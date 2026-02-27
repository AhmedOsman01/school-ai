import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IFeeStructure, FeeType } from "@/types";

export interface FeeStructureDocument extends IFeeStructure, Document {
  _id: Types.ObjectId;
}

const FeeStructureSchema = new Schema<FeeStructureDocument>(
  {
    gradeLevel: {
      type: Schema.Types.ObjectId,
      ref: "GradeLevel",
      required: true,
      index: true,
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
      index: true,
    },
    term: {
      type: Schema.Types.ObjectId,
      ref: "Term",
    },
    feeType: {
      type: String,
      enum: [
        "tuition", "registration", "transport", "cafeteria",
        "uniform", "books", "activity", "exam", "other",
      ] satisfies FeeType[],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "EGP",
    },
    description: { type: String },
    descriptionAr: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "fee_structures",
  }
);

FeeStructureSchema.index({ gradeLevel: 1, academicYear: 1, feeType: 1 });

const FeeStructure: Model<FeeStructureDocument> =
  mongoose.models.FeeStructure ||
  mongoose.model<FeeStructureDocument>("FeeStructure", FeeStructureSchema);

export default FeeStructure;
