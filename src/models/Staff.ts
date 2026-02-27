import { Schema, Types, Model, Document } from "mongoose";
import Person, { PersonDocument } from "./Person";
import type { IStaff } from "@/types";

export interface StaffDocument extends PersonDocument, Omit<IStaff, keyof PersonDocument> {
  _id: Types.ObjectId;
}

const StaffSchema = new Schema<StaffDocument>({
  employeeId: {
    type: String,
    required: [true, "Employee ID is required"],
    unique: true,
    trim: true,
    index: true,
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    index: true,
  },
  position: {
    type: String,
    required: [true, "Position is required"],
  },
  hireDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

StaffSchema.index({ department: 1, position: 1 });

const Staff: Model<StaffDocument> =
  (Person.discriminators?.["Staff"] as Model<StaffDocument>) ||
  Person.discriminator<StaffDocument>("Staff", StaffSchema);

export default Staff;
