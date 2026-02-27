import { Schema, model, models, Document, Types } from "mongoose";
import type { IStudentExamResult } from "@/types";

export interface StudentExamResultDocument extends IStudentExamResult, Document {
  _id: Types.ObjectId;
}

const studentExamResultSchema = new Schema<StudentExamResultDocument>(
  {
    exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: "Person", required: true, index: true },
    subject: { type: Schema.Types.ObjectId, ref: "CurriculumItem", required: true },
    marksObtained: { type: Number, required: true, min: 0 },
    isAbsent: { type: Boolean, default: false },
    isLateSubmission: Boolean,
    remarks: String,
    gradedBy: { type: Schema.Types.ObjectId, ref: "Person" },
    gradedAt: Date,
  },
  {
    timestamps: true,
    collection: "student_exam_results",
  }
);

// Unique index to prevent duplicate marks for the same student in the same exam
studentExamResultSchema.index({ exam: 1, student: 1 }, { unique: true });
// Secondary index for student performance queries
studentExamResultSchema.index({ student: 1, subject: 1, exam: 1 });

export const StudentExamResult =
  models.StudentExamResult ||
  model<StudentExamResultDocument>("StudentExamResult", studentExamResultSchema);

export default StudentExamResult;
