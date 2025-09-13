import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
   image: {
    url: string;
    key: string;
  };
  rank: string;
  year: string;
  quote: string;
  attempts: string;
  optional: string;
  background: string;  
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema<ITestimonial> = new Schema(
  {
    name: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      key: { type: String, required: true },
    },
    rank: { type: String, required: true },
    year: { type: String, required: true },
    quote: { type: String, required: true },
    attempts: { type: String, required: true },
    optional: { type: String, required: false },
    background: { type: String, required: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TestimonialModel: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default TestimonialModel;
