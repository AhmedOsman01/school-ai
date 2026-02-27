import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IInstallment, InstallmentStatus } from "@/types";

export interface InstallmentDocument extends IInstallment, Document {
  _id: Types.ObjectId;
}

const InstallmentSchema = new Schema<InstallmentDocument>(
  {
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
    installmentNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue", "partial"] satisfies InstallmentStatus[],
      default: "pending",
      index: true,
    },
    paidDate: { type: Date },
  },
  {
    timestamps: true,
    collection: "installments",
  }
);

InstallmentSchema.index({ invoice: 1, installmentNumber: 1 }, { unique: true });
InstallmentSchema.index({ status: 1, dueDate: 1 });

const Installment: Model<InstallmentDocument> =
  mongoose.models.Installment ||
  mongoose.model<InstallmentDocument>("Installment", InstallmentSchema);

export default Installment;
