import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IAllocation } from "@/types";

export interface AllocationDocument extends IAllocation, Document {
  _id: Types.ObjectId;
}

const AllocationSchema = new Schema<AllocationDocument>(
  {
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      index: true,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },
    lineItemIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  {
    timestamps: true,
    collection: "allocations",
  }
);

AllocationSchema.index({ payment: 1, invoice: 1 });

const Allocation: Model<AllocationDocument> =
  mongoose.models.Allocation ||
  mongoose.model<AllocationDocument>("Allocation", AllocationSchema);

export default Allocation;
