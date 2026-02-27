import { Schema, model, models, Document, Types } from "mongoose";

const busAttendanceSchema = new Schema(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "StudentTransportAssignment",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },
    recordedBy: { type: Schema.Types.ObjectId, ref: "Person" }, // usually driver
    note: String,
  },
  {
    timestamps: true,
    collection: "bus_attendance",
  }
);

// Composite index for unique attendance per assignment per day
busAttendanceSchema.index({ date: 1, assignment: 1 }, { unique: true });

export const BusAttendance =
  models.BusAttendance || model("BusAttendance", busAttendanceSchema);

export default BusAttendance;
