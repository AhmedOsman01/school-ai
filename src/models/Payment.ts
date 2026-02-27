import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IPayment, PaymentMethod } from "@/types";

export interface PaymentDocument extends IPayment, Document {
  _id: Types.ObjectId;
}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    paymentNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    method: {
      type: String,
      enum: [
        "cash", "bank_transfer", "card",
        "cheque", "online", "wallet",
      ] satisfies PaymentMethod[],
      required: true,
    },
    reference: { type: String, trim: true },
    receiptNumber: { type: String, trim: true },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    notes: { type: String },
    receivedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "payments",
  }
);

PaymentSchema.index({ date: -1 });
PaymentSchema.index({ method: 1, date: -1 });

const Payment: Model<PaymentDocument> =
  mongoose.models.Payment ||
  mongoose.model<PaymentDocument>("Payment", PaymentSchema);

export default Payment;
