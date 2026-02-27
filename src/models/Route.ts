import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IRoute } from "@/types";

export interface RouteDocument extends IRoute, Document {
  _id: Types.ObjectId;
}

const GpsPointSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    label: { type: String },
  },
  { _id: false }
);

const RouteStopSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAr: { type: String, required: true, trim: true },
    gpsPoint: { type: GpsPointSchema, required: true },
    estimatedTime: { type: String, required: true },
    sequence: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const RouteSchema = new Schema<RouteDocument>(
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
    bus: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
      index: true,
    },
    direction: {
      type: String,
      enum: ["to_school", "from_school"],
      required: true,
    },
    stops: [RouteStopSchema],
    gpsPoints: [GpsPointSchema],
    estimatedDurationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    distanceKm: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "routes",
  }
);

RouteSchema.index({ bus: 1, direction: 1 });

const Route: Model<RouteDocument> =
  mongoose.models.Route || mongoose.model<RouteDocument>("Route", RouteSchema);

export default Route;
