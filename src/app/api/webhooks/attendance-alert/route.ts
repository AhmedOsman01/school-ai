import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";
import { triggerN8nWebhook } from "@/lib/webhooks";
import type { IAttendanceAlertPayload } from "@/types";

/**
 * POST /api/webhooks/attendance-alert
 * 
 * Receives attendance data and forwards to n8n for processing.
 * n8n can then send WhatsApp notifications, emails, etc.
 * 
 * Body: { studentId, date, status }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, date, status } = body;

    if (!studentId || !date || !status) {
      return NextResponse.json(
        { error: "Missing required fields: studentId, date, status" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get student with guardian info
    const student = await Student.findById(studentId)
      .populate("guardians.guardian", "nameAr nameEn phone")
      .populate("classGroup", "nameAr nameEn");

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Find primary guardian
    const primaryGuardian = student.guardians?.find((g: { isPrimary: boolean }) => g.isPrimary);
    const guardianData = primaryGuardian?.guardian as { nameAr?: string; phone?: string } | undefined;

    const payload: IAttendanceAlertPayload = {
      event: "attendance.alert",
      timestamp: new Date().toISOString(),
      data: {
        studentId: student._id.toString(),
        studentName: student.nameAr,
        guardianPhone: guardianData?.phone || "",
        status,
        date,
        classGroup:
          (student.classGroup as { nameAr?: string })?.nameAr || "",
      },
    };

    // Forward to n8n
    const result = await triggerN8nWebhook("attendance-alert", payload);

    return NextResponse.json({
      success: true,
      n8nForwarded: result.success,
      payload,
    });
  } catch (error) {
    console.error("Attendance alert webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
