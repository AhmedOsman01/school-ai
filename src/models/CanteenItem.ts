import { Schema, model, models, Document, Types } from "mongoose";

const canteenItemSchema = new Schema(
  {
    nameAr: { type: String, required: true },
    nameEn: String,
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ["food", "drink", "snack", "other"] },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "canteen_items" }
);

export const CanteenItem =
  models.CanteenItem || model("CanteenItem", canteenItemSchema);

export default CanteenItem;
