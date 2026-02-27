import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IClassGroup } from "@/types";

export interface ClassGroupDocument extends IClassGroup, Document {
  _id: Types.ObjectId;
}

const ClassGroupSchema = new Schema<ClassGroupDocument>(
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
    capacity: {
      type: Number,
      required: true,
      default: 30,
      min: 1,
    },
    homeRoomTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Person",
    },
    room: { type: String, trim: true },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "class_groups",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ClassGroupSchema.virtual("students", {
  ref: "Person",
  localField: "_id",
  foreignField: "classGroup",
});

ClassGroupSchema.virtual("studentCount", {
  ref: "Person",
  localField: "_id",
  foreignField: "classGroup",
  count: true,
});

ClassGroupSchema.index({ gradeLevel: 1, academicYear: 1 });
ClassGroupSchema.index(
  { gradeLevel: 1, academicYear: 1, nameEn: 1 },
  { unique: true }
);

const ClassGroup: Model<ClassGroupDocument> =
  mongoose.models.ClassGroup ||
  mongoose.model<ClassGroupDocument>("ClassGroup", ClassGroupSchema);

export default ClassGroup;
