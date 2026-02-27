import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { IAnnouncement, UserRole, AnnouncementPriority } from "@/types";

export interface AnnouncementDocument extends IAnnouncement, Document {
  _id: Types.ObjectId;
}

const AnnouncementSchema = new Schema<AnnouncementDocument>(
  {
    titleAr: {
      type: String,
      required: [true, "Arabic title is required"],
      trim: true,
    },
    titleEn: {
      type: String,
      required: [true, "English title is required"],
      trim: true,
    },
    contentAr: {
      type: String,
      required: [true, "Arabic content is required"],
    },
    contentEn: {
      type: String,
      required: [true, "English content is required"],
    },
    targetRoles: [
      {
        type: String,
        enum: [
          "admin", "teacher", "student", "parent",
          "accountant", "driver", "staff",
        ] satisfies UserRole[],
      },
    ],
    targetGrades: [
      {
        type: Schema.Types.ObjectId,
        ref: "GradeLevel",
      },
    ],
    targetClassGroups: [
      {
        type: Schema.Types.ObjectId,
        ref: "ClassGroup",
      },
    ],
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"] satisfies AnnouncementPriority[],
      default: "normal",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [{ type: String }],
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: { type: Date },
    expiresAt: { type: Date, index: true },
  },
  {
    timestamps: true,
    collection: "announcements",
  }
);

AnnouncementSchema.index({ isPublished: 1, publishedAt: -1 });
AnnouncementSchema.index({ targetRoles: 1, isPublished: 1 });
AnnouncementSchema.index({ titleAr: "text", titleEn: "text", contentAr: "text", contentEn: "text" });

const Announcement: Model<AnnouncementDocument> =
  mongoose.models.Announcement ||
  mongoose.model<AnnouncementDocument>("Announcement", AnnouncementSchema);

export default Announcement;
