import { Schema, model, models, Document, Types } from "mongoose";
import type { IPerson } from "@/types";

export interface PersonDocument extends IPerson, Document {
  _id: Types.ObjectId;
}

const personSchema = new Schema<PersonDocument>(
  {
    fullNameAr: { type: String, required: true, trim: true },
    fullNameEn: { type: String, trim: true },
    nationalId: { type: String, sparse: true, index: true },
    phoneWa: { type: String, required: true, index: true },
    email: { type: String, sparse: true, lowercase: true, trim: true },
    gender: { type: String, enum: ["male", "female"], default: null },
    birthDate: Date,
    address: String,
    role: {
      type: String,
      enum: ["student", "teacher", "parent", "driver", "staff", "admin"],
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
    collection: "persons",
  }
);

export const Person = models.Person || model<PersonDocument>("Person", personSchema);

export default Person;
