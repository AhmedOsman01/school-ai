import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { ISubject } from "@/types";

export interface SubjectDocument extends ISubject, Document {
  _id: Types.ObjectId;
}

const SubjectSchema = new Schema<SubjectDocument>(
  {
    nameAr: {
      type: String,
      required: [true, "Arabic name is required"],
      trim: true,
    },
    nameEn: {
      type: String,
      required: [true, "English name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
      uppercase: true,
    },
    gradeLevel: {
      type: Schema.Types.ObjectId,
      ref: "GradeLevel",
      required: true,
      index: true,
    },
    department: { type: String, trim: true },
    creditHours: { type: Number, min: 0 },
    isCore: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "subjects",
  }
);

SubjectSchema.index({ code: 1, gradeLevel: 1 }, { unique: true });
SubjectSchema.index({ gradeLevel: 1, isActive: 1 });

const Subject: Model<SubjectDocument> =
  mongoose.models.Subject ||
  mongoose.model<SubjectDocument>("Subject", SubjectSchema);

export default Subject;
