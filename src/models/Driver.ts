import mongoose, { Schema, Types, Model, Document } from "mongoose";
import Person from "./Person";
import type { IDriver } from "@/types";

export interface DriverDocument extends IDriver, Document {
  _id: Types.ObjectId;
}

const driverSchema = new Schema<DriverDocument>({
  licenseNumber: { type: String, required: true, unique: true },
  licenseExpiry: { type: Date, required: true },
  assignedBus: { type: Schema.Types.ObjectId, ref: "Bus" },
});

const Driver: Model<any> = 
  (mongoose.models.driver as Model<any>) || 
  (Person.discriminators?.driver as Model<any>) || 
  Person.discriminator("driver", driverSchema);

export default Driver;
