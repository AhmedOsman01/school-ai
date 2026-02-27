import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IAssignment } from "@/types";

export interface AssignmentDocument extends IAssignment, Document {
  _id: Types.ObjectId;
}

const AutoGradingHintsSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["keyword", "exact", "rubric"],
    },
    criteria: [{ type: String }],
  },
  { _id: false }
);

const AssignmentSchema = new Schema<AssignmentDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    titleAr: { type: String, trim: true },
    description: { type: String },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    classGroup: {
      type: Schema.Types.ObjectId,
      ref: "ClassGroup",
      required: true,
      index: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    term: {
      type: Schema.Types.ObjectId,
      ref: "Term",
      required: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      index: true,
    },
    maxPoints: {
      type: Number,
      required: true,
      min: 1,
    },
    attachments: [{ type: String }],
    autoGradingHints: { type: AutoGradingHintsSchema },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "assignments",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AssignmentSchema.virtual("submissions", {
  ref: "Submission",
  localField: "_id",
  foreignField: "assignment",
});

AssignmentSchema.virtual("submissionCount", {
  ref: "Submission",
  localField: "_id",
  foreignField: "assignment",
  count: true,
});

AssignmentSchema.index({ classGroup: 1, subject: 1, dueDate: 1 });

const Assignment: Model<AssignmentDocument> =
  mongoose.models.Assignment ||
  mongoose.model<AssignmentDocument>("Assignment", AssignmentSchema);

export default Assignment;
