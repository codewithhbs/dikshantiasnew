import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  bgcolor: string;
  active: boolean;
}

const AnnouncementSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    bgcolor: { type: String, default: "bg-blue-500" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
