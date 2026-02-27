import mongoose, { Schema, Types, Model, Document } from "mongoose";
import Person from "./Person";
import type { IStudent } from "@/types";

export interface StudentDocument extends IStudent, Document {
  _id: Types.ObjectId;
}

const studentSchema = new Schema<StudentDocument>({
  studentCode: { type: String, required: true, unique: true, index: true },
  enrollmentDate: { type: Date, default: Date.now },
  currentGradeLevel: { type: Schema.Types.ObjectId, ref: "GradeLevel", required: true },
  classGroup: { type: Schema.Types.ObjectId, ref: "ClassGroup" },
  guardians: [{ type: Schema.Types.ObjectId, ref: "Person" }],
  transportAssignment: { type: Schema.Types.ObjectId, ref: "StudentTransportAssignment" },
  canteenWallet: { type: Schema.Types.ObjectId, ref: "StudentCanteenWallet" },
  status: { type: String, enum: ["active", "suspended", "withdrawn", "graduated"], default: "active" },
});

// Robust model registration for Next.js hot reloads
const Student = (mongoose.models.student as Model<any>) || 
                (Person.discriminators?.student as Model<any>) || 
                Person.discriminator("student", studentSchema);

export default Student;
