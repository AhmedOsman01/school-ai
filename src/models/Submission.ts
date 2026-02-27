import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { ISubmission } from "@/types";

export interface SubmissionDocument extends ISubmission, Document {
  _id: Types.ObjectId;
}

const SubmissionSchema = new Schema<SubmissionDocument>(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    content: { type: String },
    files: [{ type: String }],
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    grade: {
      type: Number,
      min: 0,
    },
    feedback: { type: String },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: "Person",
    },
    gradedAt: { type: Date },
    isLate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "submissions",
  }
);

// One submission per student per assignment
SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const Submission: Model<SubmissionDocument> =
  mongoose.models.Submission ||
  mongoose.model<SubmissionDocument>("Submission", SubmissionSchema);

export default Submission;
