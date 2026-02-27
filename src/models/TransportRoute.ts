import { Schema, model, models, Document, Types } from "mongoose";

const transportRouteSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g. "Assiut – East – School"
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    pathDescription: String,
    estimatedTimeMinutes: Number,
    feePerStudentPerMonth: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "transport_routes" }
);

export const TransportRoute =
  models.TransportRoute || model("TransportRoute", transportRouteSchema);

export default TransportRoute;
