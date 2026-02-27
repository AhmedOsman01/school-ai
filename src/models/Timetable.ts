import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { ITimetable } from "@/types";

export interface TimetableDocument extends ITimetable, Document {
  _id: Types.ObjectId;
}

const TimetableSchema = new Schema<TimetableDocument>(
  {
    classGroup: {
      type: Schema.Types.ObjectId,
      ref: "ClassGroup",
      required: true,
      index: true,
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
    isActive: {
      type: Boolean,
      default: true,
    },
    effectiveFrom: {
      type: Date,
      required: true,
    },
    effectiveTo: { type: Date },
  },
  {
    timestamps: true,
    collection: "timetables",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TimetableSchema.virtual("slots", {
  ref: "ScheduleSlot",
  localField: "_id",
  foreignField: "timetable",
});

TimetableSchema.index({ classGroup: 1, academicYear: 1, term: 1 });

const Timetable: Model<TimetableDocument> =
  mongoose.models.Timetable ||
  mongoose.model<TimetableDocument>("Timetable", TimetableSchema);

export default Timetable;
