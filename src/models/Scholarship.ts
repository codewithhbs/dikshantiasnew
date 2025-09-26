import mongoose, { Schema, Document } from "mongoose";

export interface IScholarship extends Document {
  name: string;
  phone: string;
  email: string;
  course?: string;
  message?: string;
  scholarship?: string;
  createdAt: Date;
}

const ScholarshipSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String },
  message: { type: String },
  scholarship: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite on hot-reload
export default mongoose.models.Scholarship ||
  mongoose.model<IScholarship>("Scholarship", ScholarshipSchema);
