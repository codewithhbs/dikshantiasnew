import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResult extends Document {
  name: string;
  rank: string;
  service: string;
  year: string;
  desc?: string;
  btnName?: string;
  btnLink?: string;   
 image: {
    url: string;
    public_url: string;
    public_id: string;
  };
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ResultSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    rank: { type: String},
    service: { type: String},
    year: { type: String},
    desc: { type: String },
    btnName: { type: String },
    btnLink: { type: String }, 
    image: {
      url: { type: String},
      public_url: { type: String},
      public_id: { type: String},
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ResultModel: Model<IResult> =
  mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema, "results");

export default ResultModel; 