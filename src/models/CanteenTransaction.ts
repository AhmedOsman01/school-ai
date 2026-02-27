import { Schema, model, models, Document, Types } from "mongoose";

const canteenTransactionSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    wallet: { type: Schema.Types.ObjectId, ref: "StudentCanteenWallet" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["purchase", "recharge", "refund"] },
    order: { type: Schema.Types.ObjectId, ref: "CanteenOrder" },
    paymentMethod: String,
    note: String,
  },
  { timestamps: true, collection: "canteen_transactions" }
);

export const CanteenTransaction =
  models.CanteenTransaction || model("CanteenTransaction", canteenTransactionSchema);

export default CanteenTransaction;
