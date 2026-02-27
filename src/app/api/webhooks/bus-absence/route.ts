import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BusAttendance from "@/models/BusAttendance";
import Student from "@/models/Student";
import { triggerN8nWebhook } from "@/lib/webhooks";
import type { IBusAbsencePayload } from "@/types";

/**
 * POST /api/webhooks/bus-absence
 * 
 * Alerts parents when a student is absent from the bus.
 * 
 * Body: { busAttendanceId } or { busId, date }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { busAttendanceId, busId, date } = body;

    await connectDB();

    let absences;

    if (busAttendanceId) {
      const record = await BusAttendance.findById(busAttendanceId)
        .populate("student", "nameAr nameEn guardians")
        .populate("bus", "busNumber")
        .populate("route", "nameAr nameEn");
      absences = record ? [record] : [];
    } else if (busId && date) {
      absences = await BusAttendance.find({
        bus: busId,
        date: new Date(date),
        boardingStatus: "absent",
      })
        .populate({
          path: "student",
          select: "nameAr nameEn guardians",
          populate: {
            path: "guardians.guardian",
            select: "phone",
          },
        })
        .populate("bus", "busNumber")
        .populate("route", "nameAr nameEn");
    } else {
      return NextResponse.json(
        { error: "Missing: busAttendanceId or (busId + date)" },
        { status: 400 }
      );
    }

    const results = [];

    for (const absence of absences) {
      const student = absence.student as unknown as {
        _id: { toString(): string };
        nameAr: string;
        guardians?: Array<{
          guardian: { phone?: string };
          isPrimary: boolean;
        }>;
      };

      const bus = absence.bus as unknown as { busNumber: string };
      const route = absence.route as unknown as { nameAr: string };
      const primaryGuardian = student.guardians?.find((g) => g.isPrimary);

      const payload: IBusAbsencePayload = {
        event: "bus.absence",
        timestamp: new Date().toISOString(),
        data: {
          studentId: student._id.toString(),
          studentName: student.nameAr,
          guardianPhone: primaryGuardian?.guardian?.phone || "",
          busNumber: bus?.busNumber || "",
          route: route?.nameAr || "",
          date: absence.date.toISOString(),
        },
      };

      const result = await triggerN8nWebhook("bus-absence", payload);
      results.push({
        studentId: student._id.toString(),
        forwarded: result.success,
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Bus absence webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
