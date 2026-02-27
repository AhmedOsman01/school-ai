import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { ICurriculumItem } from "@/types";

export interface CurriculumItemDocument extends ICurriculumItem, Document {
  _id: Types.ObjectId;
}

const CurriculumItemSchema = new Schema<CurriculumItemDocument>(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    term: {
      type: Schema.Types.ObjectId,
      ref: "Term",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    titleAr: {
      type: String,
      required: [true, "Arabic title is required"],
      trim: true,
    },
    description: { type: String },
    objectives: [{ type: String }],
    resources: [{ type: String }],
    weekNumber: { type: Number, min: 1 },
    sequence: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
    collection: "curriculum_items",
  }
);

CurriculumItemSchema.index({ subject: 1, term: 1, sequence: 1 });

const CurriculumItem: Model<CurriculumItemDocument> =
  mongoose.models.CurriculumItem ||
  mongoose.model<CurriculumItemDocument>("CurriculumItem", CurriculumItemSchema);

export default CurriculumItem;
