import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StudentExamResult from "@/models/StudentExamResult";
import { triggerN8nWebhook } from "@/lib/webhooks";
import type { IExamResultPayload } from "@/types";

/**
 * POST /api/webhooks/exam-result
 * 
 * Notifies parents about exam results via n8n → WhatsApp.
 * 
 * Body: { examId } - sends all results for this exam
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { examId } = body;

    if (!examId) {
      return NextResponse.json(
        { error: "Missing required field: examId" },
        { status: 400 }
      );
    }

    await connectDB();

    const results = await StudentExamResult.find({ exam: examId })
      .populate({
        path: "student",
        select: "nameAr nameEn guardians",
        populate: {
          path: "guardians.guardian",
          select: "phone",
        },
      })
      .populate({
        path: "exam",
        select: "title titleAr maxMarks",
        populate: {
          path: "subject",
          select: "nameAr nameEn",
        },
      });

    const webhookResults = [];

    for (const result of results) {
      const student = result.student as unknown as {
        _id: { toString(): string };
        nameAr: string;
        guardians?: Array<{
          guardian: { phone?: string };
          isPrimary: boolean;
        }>;
      };

      const exam = result.exam as unknown as {
        titleAr: string;
        maxMarks: number;
        subject: { nameAr: string };
      };

      const primaryGuardian = student.guardians?.find((g) => g.isPrimary);

      const payload: IExamResultPayload = {
        event: "exam.result",
        timestamp: new Date().toISOString(),
        data: {
          studentId: student._id.toString(),
          studentName: student.nameAr,
          guardianPhone: primaryGuardian?.guardian?.phone || "",
          examTitle: exam.titleAr,
          subject: exam.subject?.nameAr || "",
          marksObtained: result.marksObtained,
          maxMarks: exam.maxMarks,
          grade: result.grade || "",
        },
      };

      const webhookResult = await triggerN8nWebhook("exam-result", payload);
      webhookResults.push({
        studentId: student._id.toString(),
        forwarded: webhookResult.success,
      });
    }

    return NextResponse.json({
      success: true,
      processed: webhookResults.length,
      results: webhookResults,
    });
  } catch (error) {
    console.error("Exam result webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
