import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IInvoice, InvoiceStatus, FeeType } from "@/types";

export interface InvoiceDocument extends IInvoice, Document {
  _id: Types.ObjectId;
}

const InvoiceLineItemSchema = new Schema(
  {
    feeType: {
      type: String,
      enum: [
        "tuition", "registration", "transport", "cafeteria",
        "uniform", "books", "activity", "exam", "other",
      ] satisfies FeeType[],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: { type: String },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Schema.Types.ObjectId,
      ref: "Discount",
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    netAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<InvoiceDocument>(
  {
    invoiceNumber: {
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
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    term: {
      type: Schema.Types.ObjectId,
      ref: "Term",
    },
    lineItems: {
      type: [InvoiceLineItemSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length > 0,
        message: "Invoice must have at least one line item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    balanceDue: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "draft", "issued", "partially_paid", "paid",
        "overdue", "cancelled", "refunded",
      ] satisfies InvoiceStatus[],
      default: "draft",
      index: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    issuedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // ─── ETA Egypt e-Invoicing ───────────────
    etaUuid: { type: String, sparse: true, unique: true },
    etaSubmissionId: { type: String },
    etaStatus: { type: String },
    etaQrCode: { type: String },
    notes: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "invoices",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

InvoiceSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "invoice",
});

InvoiceSchema.virtual("installments", {
  ref: "Installment",
  localField: "_id",
  foreignField: "invoice",
});

InvoiceSchema.index({ student: 1, academicYear: 1, status: 1 });
InvoiceSchema.index({ status: 1, dueDate: 1 });
InvoiceSchema.index({ issuedDate: -1 });

const Invoice: Model<InvoiceDocument> =
  mongoose.models.Invoice ||
  mongoose.model<InvoiceDocument>("Invoice", InvoiceSchema);

export default Invoice;
