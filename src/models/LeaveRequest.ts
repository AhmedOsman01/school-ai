import { Schema, model, models, Document, Types } from 'mongoose';

export interface ILeaveRequest extends Document {
  staff: Types.ObjectId;
  leaveType: 'sick' | 'annual' | 'emergency' | 'unpaid' | 'maternity' | 'paternity';
  startDate: Date;
  endDate: Date;
  daysCount: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: Types.ObjectId;
  comments?: string;
  createdAt: Date;
}

const leaveRequestSchema = new Schema<ILeaveRequest>({
  staff: { type: Schema.Types.ObjectId, ref: 'Person', required: true, index: true },
  leaveType: { 
    type: String, 
    enum: ['sick', 'annual', 'emergency', 'unpaid', 'maternity', 'paternity'], 
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  daysCount: { type: Number, required: true },
  reason: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'cancelled'], 
    default: 'pending' 
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'Person' },
  comments: String,
}, { 
  timestamps: true,
  collection: "leave_requests" 
});

export default models.LeaveRequest || model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);
