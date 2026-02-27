import mongoose, { Schema, model, models, Document, Types } from "mongoose";

const busSchema = new Schema(
  {
    plateNumber: { type: String, required: true, unique: true },
    model: String,
    capacity: { type: Number, min: 10, required: true },
    driver: { type: Schema.Types.ObjectId, ref: "Person" },
    route: { type: Schema.Types.ObjectId, ref: "TransportRoute" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "buses" }
);

export const Bus = models.Bus || model("Bus", busSchema);

export default Bus;
