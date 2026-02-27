import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { ITermSummary, GradeLetter } from "@/types";

export interface TermSummaryDocument extends ITermSummary, Document {
  _id: Types.ObjectId;
}

const SubjectResultSchema = new Schema(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    examAverage: { type: Number, required: true, min: 0, max: 100 },
    assignmentAverage: { type: Number, required: true, min: 0, max: 100 },
    finalGrade: { type: Number, required: true, min: 0, max: 100 },
    gradeLetter: {
      type: String,
      enum: [
        "A+", "A", "A-", "B+", "B", "B-",
        "C+", "C", "C-", "D+", "D", "F",
      ] satisfies GradeLetter[],
      required: true,
    },
  },
  { _id: false }
);

const TermSummarySchema = new Schema<TermSummaryDocument>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    term: {
      type: Schema.Types.ObjectId,
      ref: "Term",
      required: true,
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    classGroup: {
      type: Schema.Types.ObjectId,
      ref: "ClassGroup",
      required: true,
    },
    subjectResults: [SubjectResultSchema],
    gpa: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
    },
    rank: { type: Number, min: 1 },
    totalStudents: { type: Number, min: 1 },
    teacherRemarks: { type: String },
    adminRemarks: { type: String },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "term_summaries",
  }
);

// One summary per student per term
TermSummarySchema.index({ student: 1, term: 1, academicYear: 1 }, { unique: true });
TermSummarySchema.index({ classGroup: 1, term: 1, gpa: -1 });
TermSummarySchema.index({ classGroup: 1, term: 1, rank: 1 });

const TermSummary: Model<TermSummaryDocument> =
  mongoose.models.TermSummary ||
  mongoose.model<TermSummaryDocument>("TermSummary", TermSummarySchema);

export default TermSummary;
