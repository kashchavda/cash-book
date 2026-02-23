import mongoose, { Schema, Document } from "mongoose";

export interface ISite extends Document {
  name: string;
  supervisor: mongoose.Types.ObjectId;
}

const siteSchema = new Schema<ISite>(
  {
    name: { type: String, required: true },
    supervisor: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const Site = mongoose.model<ISite>("Site", siteSchema);