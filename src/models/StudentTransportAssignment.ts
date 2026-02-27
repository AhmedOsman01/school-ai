import { Schema, model, models, Document, Types } from "mongoose";

const studentTransportAssignmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    route: {
      type: Schema.Types.ObjectId,
      ref: "TransportRoute",
      required: true,
    },
    bus: { type: Schema.Types.ObjectId, ref: "Bus", required: true },
    seatNumber: String,
    pickupPoint: String,
    dropoffPoint: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "student_transport_assignments" }
);

export const StudentTransportAssignment =
  models.StudentTransportAssignment ||
  model("StudentTransportAssignment", studentTransportAssignmentSchema);

export default StudentTransportAssignment;
