import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICurrentAffairs extends Document {
  title: string;
  slug: string;
  shortContent: string;
  content: string;
  category: mongoose.Schema.Types.ObjectId;
  subCategory: mongoose.Schema.Types.ObjectId;
  image?: {
    key: string; // S3 key for deletion
    url: string; // Public URL
  };
  imageAlt?: string;
  active: boolean;
  affairDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const CurrentAffairsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortContent: { type: String },
    content: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: false,
    },
    image: {
      key: { type: String },
      url: { type: String },
    },
    imageAlt: String,
    active: { type: Boolean, default: true },
    affairDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const CurrentAffairs: Model<ICurrentAffairs> =
  mongoose.models.CurrentAffairs ||
  mongoose.model("CurrentAffairs", CurrentAffairsSchema);

export default CurrentAffairs;
