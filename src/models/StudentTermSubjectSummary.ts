import { Schema, model, models, Document, Types } from "mongoose";
import type { IStudentTermSubjectSummary } from "@/types";

export interface StudentTermSubjectSummaryDocument extends IStudentTermSubjectSummary, Document {
  _id: Types.ObjectId;
}

const termSubjectSummarySchema = new Schema<StudentTermSubjectSummaryDocument>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Person", required: true, index: true },
    term: { type: Schema.Types.ObjectId, ref: "Term", required: true, index: true },
    subject: { type: Schema.Types.ObjectId, ref: "CurriculumItem", required: true },
    totalMarksObtained: { type: Number, default: 0 },
    totalMaxMarks: { type: Number, default: 0 },
    percentage: { type: Number, min: 0, max: 100 },
    gradeLetter: String,
    gpaPoint: { type: Number, min: 0, max: 5 },
    remarks: String,
    rankInClass: Number,
    lastCalculatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "student_term_subject_summaries",
  }
);

termSubjectSummarySchema.index({ student: 1, term: 1, subject: 1 }, { unique: true });

export const StudentTermSubjectSummary =
  models.StudentTermSubjectSummary ||
  model<StudentTermSubjectSummaryDocument>("StudentTermSubjectSummary", termSubjectSummarySchema);

export default StudentTermSubjectSummary;
