import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IGradeLevel } from "@/types";

export interface GradeLevelDocument extends IGradeLevel, Document {
  _id: Types.ObjectId;
}

const GradeLevelSchema = new Schema<GradeLevelDocument>(
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
      required: [true, "Grade code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    sequence: {
      type: Number,
      required: true,
      index: true,
    },
    stage: {
      type: String,
      enum: ["kg", "primary", "preparatory", "secondary"],
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "grade_levels",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

GradeLevelSchema.virtual("classGroups", {
  ref: "ClassGroup",
  localField: "_id",
  foreignField: "gradeLevel",
});

GradeLevelSchema.virtual("subjects", {
  ref: "Subject",
  localField: "_id",
  foreignField: "gradeLevel",
});

GradeLevelSchema.index({ stage: 1, sequence: 1 });

const GradeLevel: Model<GradeLevelDocument> =
  mongoose.models.GradeLevel ||
  mongoose.model<GradeLevelDocument>("GradeLevel", GradeLevelSchema);

export default GradeLevel;
