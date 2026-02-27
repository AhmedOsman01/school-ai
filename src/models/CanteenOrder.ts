import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { ICanteenOrder, OrderStatus } from "@/types";

export interface CanteenOrderDocument extends ICanteenOrder, Document {
  _id: Types.ObjectId;
}

const CanteenOrderItemSchema = new Schema(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: "CanteenItem",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const CanteenOrderSchema = new Schema<CanteenOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    items: {
      type: [CanteenOrderItemSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length > 0,
        message: "Order must have at least one item",
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["wallet", "invoice", "cash"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending", "preparing", "ready",
        "delivered", "cancelled",
      ] satisfies OrderStatus[],
      default: "pending",
      index: true,
    },
    orderedBy: {
      type: String,
      enum: ["student", "parent", "staff"],
      required: true,
    },
    orderedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    fulfilledAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "canteen_orders",
  }
);

CanteenOrderSchema.index({ student: 1, orderedAt: -1 });
CanteenOrderSchema.index({ status: 1, orderedAt: -1 });

const CanteenOrder: Model<CanteenOrderDocument> =
  mongoose.models.CanteenOrder ||
  mongoose.model<CanteenOrderDocument>("CanteenOrder", CanteenOrderSchema);

export default CanteenOrder;
