import { Schema, model, models, Document, Types } from "mongoose";

const dailyMenuSchema = new Schema(
  {
    date: { type: Date, required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    items: [
      {
        item: { type: Schema.Types.ObjectId, ref: "CanteenItem" },
        quantityAvailable: Number,
      },
    ],
  },
  {
    timestamps: true,
    collection: "daily_menus",
  }
);

dailyMenuSchema.index({ date: 1, branch: 1 });

export const DailyMenu = models.DailyMenu || model("DailyMenu", dailyMenuSchema);

export default DailyMenu;
