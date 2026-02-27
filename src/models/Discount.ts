import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IDiscount, DiscountType, FeeType } from "@/types";

export interface DiscountDocument extends IDiscount, Document {
  _id: Types.ObjectId;
}

const DiscountSchema = new Schema<DiscountDocument>(
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
    type: {
      type: String,
      enum: ["percentage", "fixed"] satisfies DiscountType[],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    criteria: { type: String },
    maxUses: { type: Number, min: 0 },
    currentUses: {
      type: Number,
      default: 0,
      min: 0,
    },
    validFrom: { type: Date },
    validTo: { type: Date },
    applicableFeeTypes: [
      {
        type: String,
        enum: [
          "tuition", "registration", "transport", "cafeteria",
          "uniform", "books", "activity", "exam", "other",
        ] satisfies FeeType[],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "discounts",
  }
);

const Discount: Model<DiscountDocument> =
  mongoose.models.Discount ||
  mongoose.model<DiscountDocument>("Discount", DiscountSchema);

export default Discount;
