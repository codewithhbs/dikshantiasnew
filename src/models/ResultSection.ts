import mongoose, { Schema, Document } from "mongoose"

export interface IResultSection extends Document {
  description: string
  buttonText: string
  buttonLink: string
}

const ResultSectionSchema = new Schema<IResultSection>(
  {
    description: { type: String, required: true },
    buttonText: { type: String, default: "View All Results" },
    buttonLink: { type: String, default: "/results" },
  },
  { timestamps: true }
)

export default mongoose.models.ResultSection ||
  mongoose.model<IResultSection>("ResultSection", ResultSectionSchema, "resultsections")

