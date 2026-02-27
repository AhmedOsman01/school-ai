import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IMenu, MealType } from "@/types";

export interface MenuDocument extends IMenu, Document {
  _id: Types.ObjectId;
}

const MenuSchema = new Schema<MenuDocument>(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "snack"] satisfies MealType[],
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "CanteenItem",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "menus",
  }
);

MenuSchema.index({ date: 1, mealType: 1 }, { unique: true });

const Menu: Model<MenuDocument> =
  mongoose.models.Menu || mongoose.model<MenuDocument>("Menu", MenuSchema);

export default Menu;
