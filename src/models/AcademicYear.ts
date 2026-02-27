import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IAcademicYear } from "@/types";

export interface AcademicYearDocument extends IAcademicYear, Document {
  _id: Types.ObjectId;
}

const AcademicYearSchema = new Schema<AcademicYearDocument>(
  {
    nameAr: {
      type: String,
      required: [true, "Arabic name is required"],
      trim: true,
    },
    nameEn: {
      type: String,
      required: [true, "English name is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "academic_years",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure only one current academic year
AcademicYearSchema.pre("save", async function () {
  if (this.isCurrent && this.isModified("isCurrent")) {
    await mongoose.model("AcademicYear").updateMany(
      { _id: { $ne: this._id } },
      { isCurrent: false }
    );
  }
});

// Virtual: terms
AcademicYearSchema.virtual("terms", {
  ref: "Term",
  localField: "_id",
  foreignField: "academicYear",
});

const AcademicYear: Model<AcademicYearDocument> =
  mongoose.models.AcademicYear ||
  mongoose.model<AcademicYearDocument>("AcademicYear", AcademicYearSchema);

export default AcademicYear;
