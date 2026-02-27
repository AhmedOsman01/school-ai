import { Schema, Types, Model, Document } from "mongoose";
import Person, { PersonDocument } from "./Person";
import type { ITeacher } from "@/types";

export interface TeacherDocument extends PersonDocument, Omit<ITeacher, keyof PersonDocument> {
  _id: Types.ObjectId;
}

const TeacherSchema = new Schema<TeacherDocument>({
  employeeId: {
    type: String,
    required: [true, "Employee ID is required"],
    unique: true,
    trim: true,
    index: true,
  },
  subjects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  qualifications: [{ type: String }],
  specialization: { type: String },
  hireDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  classGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: "ClassGroup",
    },
  ],
});

TeacherSchema.index({ subjects: 1 });
TeacherSchema.index({ classGroups: 1 });

const Teacher: Model<TeacherDocument> =
  (Person.discriminators?.["Teacher"] as Model<TeacherDocument>) ||
  Person.discriminator<TeacherDocument>("Teacher", TeacherSchema);

export default Teacher;
