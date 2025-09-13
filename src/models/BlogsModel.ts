import mongoose, { Schema, Document } from "mongoose";

interface BlogDocument extends Document {
  title: string;
  slug: string;
  shortContent: string;
  content: string;
  category: mongoose.Types.ObjectId;
  postedBy: string;
  image: {
    url: string;
    key: string;
    alt: string;
  };
  tags: string[];
  active: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  index: boolean;
  follow: boolean;
}

const BlogSchema = new Schema<BlogDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortContent: { type: String },
    content: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "BlogCategory" },
    postedBy: { type: String },

    image: {
      url: { type: String, required: true },
      key: { type: String, required: true },
      alt: { type: String, default: "" },
    },

    tags: [{ type: String }],
    active: { type: Boolean, default: true },

    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    index: { type: Boolean, default: true },
    follow: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Blog ||
  mongoose.model<BlogDocument>("Blog", BlogSchema);
