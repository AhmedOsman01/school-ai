import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { ITerm } from "@/types";

export interface TermDocument extends ITerm, Document {
  _id: Types.ObjectId;
}

const TermSchema = new Schema<TermDocument>(
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
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    sequence: {
      type: Number,
      required: true,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "terms",
  }
);

TermSchema.index({ academicYear: 1, sequence: 1 }, { unique: true });

const Term: Model<TermDocument> =
  mongoose.models.Term || mongoose.model<TermDocument>("Term", TermSchema);

export default Term;
