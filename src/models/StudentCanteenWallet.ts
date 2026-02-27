import { Schema, model, models, Document, Types } from "mongoose";

const canteenWalletSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 0, min: 0 },
    lastRecharge: Date,
    lastUsage: Date,
  },
  { timestamps: true, collection: "student_canteen_wallets" }
);

export const StudentCanteenWallet =
  models.StudentCanteenWallet || model("StudentCanteenWallet", canteenWalletSchema);

export default StudentCanteenWallet;
