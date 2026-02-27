import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IScheduleSlot, DayOfWeek } from "@/types";

export interface ScheduleSlotDocument extends IScheduleSlot, Document {
  _id: Types.ObjectId;
}

const ScheduleSlotSchema = new Schema<ScheduleSlotDocument>(
  {
    timetable: {
      type: Schema.Types.ObjectId,
      ref: "Timetable",
      required: true,
      index: true,
    },
    dayOfWeek: {
      type: String,
      enum: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
      ] satisfies DayOfWeek[],
      required: true,
    },
    periodNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    startTime: {
      type: String,
      required: true,
      match: /^\d{2}:\d{2}$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^\d{2}:\d{2}$/,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    room: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: "schedule_slots",
  }
);

// Prevent double-booking: same timetable, day, period
ScheduleSlotSchema.index(
  { timetable: 1, dayOfWeek: 1, periodNumber: 1 },
  { unique: true }
);
// Prevent teacher double-booking
ScheduleSlotSchema.index({ teacher: 1, dayOfWeek: 1, periodNumber: 1 });

const ScheduleSlot: Model<ScheduleSlotDocument> =
  mongoose.models.ScheduleSlot ||
  mongoose.model<ScheduleSlotDocument>("ScheduleSlot", ScheduleSlotSchema);

export default ScheduleSlot;
