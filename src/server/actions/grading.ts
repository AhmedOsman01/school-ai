"use server";

import { z } from "zod";
import connectDB from "@/lib/db";
import { StudentExamResult, Exam, Person } from "@/models";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const GradingSchema = z.object({
  examId: z.string().min(1),
  results: z.array(
    z.object({
      studentId: z.string().min(1),
      marksObtained: z.number().min(0),
      isAbsent: z.boolean().default(false),
      remarks: z.string().optional(),
    })
  ),
});

export async function saveExamResults(input: z.infer<typeof GradingSchema>) {
  try {
    const session = await auth();
    if (!session?.user || !["admin", "teacher"].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const { examId, results } = GradingSchema.parse(input);
    await connectDB();

    // 1. Verify exam exists and belongs to the teacher (if not admin)
    const exam = await Exam.findById(examId);
    if (!exam) return { success: false, error: "Exam not found" };

    if (session.user.role === "teacher" && exam.createdBy.toString() !== session.user.id) {
      // Check if teacher is actually the creator or assigned to this subject
      // For now, only creator or admin
      return { success: false, error: "You are not authorized to grade this exam" };
    }

    // 2. Bulk upsert results
    const operations = results.map((res) => ({
      updateOne: {
        filter: { exam: examId, student: res.studentId },
        update: {
          $set: {
            subject: exam.subject, // Denormalized from exam
            marksObtained: res.isAbsent ? 0 : res.marksObtained,
            isAbsent: res.isAbsent,
            remarks: res.remarks,
            gradedBy: session.user.id,
            gradedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    await StudentExamResult.bulkWrite(operations);

    // 3. Trigger WhatsApp Webhooks via n8n for each result
    // (In production, you'd queue this to avoid slowing down the response)
    const populatedExam = await Exam.findById(examId).populate("subject");
    for (const res of results) {
      const student = await Person.findById(res.studentId);
      if (student?.phoneWa) {
        const { triggerWebhook } = await import("@/lib/webhooks");
        triggerWebhook("exam-result", {
          studentId: res.studentId,
          studentName: student.fullNameAr,
          guardianPhone: student.phoneWa,
          examTitle: populatedExam.nameAr,
          subject: populatedExam.subject.titleAr || "المادة",
          marksObtained: res.marksObtained,
          maxMarks: exam.maxMarks,
          grade: res.marksObtained >= exam.maxMarks * 0.9 ? "امتياز" : "جيد"
        });
      }
    }

    revalidatePath(`/dashboard/exams/${examId}/grade`);
    return { success: true };
  } catch (error: any) {
    console.error("Grading error:", error);
    return { success: false, error: error.message || "Failed to save results" };
  }
}
