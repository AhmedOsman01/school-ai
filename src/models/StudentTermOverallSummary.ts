import { Schema, model, models, Document, Types } from "mongoose";
import type { IStudentTermOverallSummary } from "@/types";

export interface StudentTermOverallSummaryDocument extends IStudentTermOverallSummary, Document {
  _id: Types.ObjectId;
}

const termOverallSummarySchema = new Schema<StudentTermOverallSummaryDocument>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Person", required: true, index: true },
    term: { type: Schema.Types.ObjectId, ref: "Term", required: true, index: true },
    totalWeightedMarks: Number,
    totalWeightedMax: Number,
    overallPercentage: Number,
    overallGPA: Number,
    overallGrade: String,
    classRank: Number,
    subjectsCount: Number,
    passedSubjects: Number,
    calculatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "student_term_overall_summaries",
  }
);

termOverallSummarySchema.index({ student: 1, term: 1 }, { unique: true });

export const StudentTermOverallSummary =
  models.StudentTermOverallSummary ||
  model<StudentTermOverallSummaryDocument>("StudentTermOverallSummary", termOverallSummarySchema);

export default StudentTermOverallSummary;
