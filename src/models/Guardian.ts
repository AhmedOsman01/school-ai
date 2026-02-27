import { Schema, Types, Model, Document } from "mongoose";
import Person, { PersonDocument } from "./Person";
import type { IGuardian } from "@/types";

export interface GuardianDocument extends PersonDocument, Omit<IGuardian, keyof PersonDocument> {
  _id: Types.ObjectId;
}

const GuardianSchema = new Schema<GuardianDocument>({
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Person",
      index: true,
    },
  ],
  occupation: { type: String },
  workplace: { type: String },
  emergencyContact: {
    type: Boolean,
    default: true,
  },
});

GuardianSchema.index({ students: 1 });

const Guardian: Model<GuardianDocument> =
  (Person.discriminators?.["Guardian"] as Model<GuardianDocument>) ||
  Person.discriminator<GuardianDocument>("Guardian", GuardianSchema);

export default Guardian;
