import { Schema, model, models, Document, Types } from 'mongoose';

export interface IStaffContract extends Document {
  staff: Types.ObjectId;                  // Reference to Person (Staff/Teacher)
  contractType: 'full-time' | 'part-time' | 'temporary' | 'consultant';
  baseSalary: number;                     // Monthly base
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowances?: number;
  insuranceDeduction?: number;            // Social insurance
  taxDeduction?: number;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  currency: string;                       // Always EGP for Egypt
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const staffContractSchema = new Schema<IStaffContract>({
  staff: { type: Schema.Types.ObjectId, ref: 'Person', required: true, index: true },
  contractType: { 
    type: String, 
    enum: ['full-time', 'part-time', 'temporary', 'consultant'], 
    default: 'full-time' 
  },
  baseSalary: { type: Number, required: true },
  housingAllowance: { type: Number, default: 0 },
  transportAllowance: { type: Number, default: 0 },
  otherAllowances: { type: Number, default: 0 },
  insuranceDeduction: { type: Number, default: 0 },
  taxDeduction: { type: Number, default: 0 },
  bankAccountName: String,
  bankAccountNumber: String,
  bankName: String,
  currency: { type: String, default: 'EGP' },
  startDate: { type: Date, required: true },
  endDate: Date,
  isActive: { type: Boolean, default: true },
}, { 
  timestamps: true,
  collection: "staff_contracts" 
});

export default models.StaffContract || model<IStaffContract>('StaffContract', staffContractSchema);
