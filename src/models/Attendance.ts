import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IAttendance, AttendanceStatus } from "@/types";

export interface AttendanceDocument extends IAttendance, Document {
  _id: Types.ObjectId;
}

const AttendanceSchema = new Schema<AttendanceDocument>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    classGroup: {
      type: Schema.Types.ObjectId,
      ref: "ClassGroup",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"] satisfies AttendanceStatus[],
      required: true,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    notes: { type: String },
  },
  {
    timestamps: true,
    collection: "attendance",
  }
);

// One record per student per day
AttendanceSchema.index({ student: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ classGroup: 1, date: 1 });
AttendanceSchema.index({ date: 1, status: 1 });

const Attendance: Model<AttendanceDocument> =
  mongoose.models.Attendance ||
  mongoose.model<AttendanceDocument>("Attendance", AttendanceSchema);

export default Attendance;
