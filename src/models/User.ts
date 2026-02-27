import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IUser, UserRole } from "@/types";

export interface UserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "teacher",
        "student",
        "parent",
        "accountant",
        "driver",
        "staff",
      ] satisfies UserRole[],
      required: true,
      index: true,
    },
    person: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      sparse: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLogin: { type: Date },
    preferences: {
      locale: {
        type: String,
        enum: ["ar", "en"],
        default: "ar",
      },
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
    },
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.index({ role: 1, isActive: 1 });

const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
