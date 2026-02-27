import { Schema, model, models, Document, Types } from "mongoose";
import type { IExam } from "@/types";

export interface ExamDocument extends IExam, Document {
  _id: Types.ObjectId;
}

const examSchema = new Schema<ExamDocument>(
  {
    term: { type: Schema.Types.ObjectId, ref: "Term", required: true, index: true },
    nameAr: { type: String, required: true, trim: true },
    nameEn: { type: String, trim: true },
    examType: {
      type: String,
      enum: ["quiz", "midterm", "final", "practical", "oral", "project"],
      required: true,
    },
    subject: { type: Schema.Types.ObjectId, ref: "CurriculumItem", required: true },
    examDate: { type: Date, required: true },
    maxMarks: { type: Number, required: true, min: 1 },
    weightPercentage: { type: Number, required: true, min: 0, max: 100 },
    durationMinutes: Number,
    instructions: String,
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "Person", required: true },
  },
  {
    timestamps: true,
    collection: "exams",
  }
);

examSchema.index({ term: 1, subject: 1 });
examSchema.index({ examDate: 1 });

export const Exam = models.Exam || model<ExamDocument>("Exam", examSchema);

export default Exam;
