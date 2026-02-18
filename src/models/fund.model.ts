import mongoose, { Schema, Document } from "mongoose";

export interface IFund extends Document {
  amount: number;
  note?: string;

  paymentStatus: string; 
  paymentMethod: string; 

  location: string;
  transferTo: string;
  business: string;
  supervisor: string;

  date: string; 
  time: string;

  attachmentUrl?: string;
  attachmentType?: "image" | "pdf" | "none";
}

const fundSchema = new Schema<IFund>(
  {
    amount: { type: Number, required: true },
    note: { type: String },

    paymentStatus: { type: String, required: true },
    paymentMethod: { type: String, required: true },

    location: { type: String, required: true },
    transferTo: { type: String, required: true },
    business: { type: String, required: true },
    supervisor: { type: String, required: true },

    date: { type: String, required: true },
    time: { type: String, required: true },

    attachmentUrl: { type: String },
    attachmentType: {
      type: String,
      enum: ["image", "pdf", "none"],
      default: "none"
    }
  },
  { timestamps: true }
);

export const Fund = mongoose.model<IFund>("Fund", fundSchema);
