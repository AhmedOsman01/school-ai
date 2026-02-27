import { Schema, model, models, Document, Types } from 'mongoose';

export interface IPayslip extends Document {
  staff: Types.ObjectId;
  contract: Types.ObjectId;
  month: number;                          // 1-12
  year: number;
  baseSalarySnapshot: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  paymentDate?: Date;
  reference?: string;                     // Bank transfer reference
  remarks?: string;
  createdAt: Date;
}

const payslipSchema = new Schema<IPayslip>({
  staff: { type: Schema.Types.ObjectId, ref: 'Person', required: true, index: true },
  contract: { type: Schema.Types.ObjectId, ref: 'StaffContract', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  baseSalarySnapshot: { type: Number, required: true },
  totalAllowances: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'processed', 'paid', 'cancelled'], 
    default: 'draft' 
  },
  paymentDate: Date,
  reference: String,
  remarks: String,
}, { 
  timestamps: true,
  collection: "payslips" 
});

// Composite index to prevent duplicate payslips for same month/year
payslipSchema.index({ staff: 1, month: 1, year: 1 }, { unique: true });

export default models.Payslip || model<IPayslip>('Payslip', payslipSchema);
