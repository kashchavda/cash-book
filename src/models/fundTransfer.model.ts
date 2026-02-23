import mongoose, { Schema, Document } from "mongoose";

export interface IFundTransfer extends Document {
  date: Date;
  supervisor: mongoose.Types.ObjectId;
  location: string;
  amount: number;
  mode: string;
  remark: string;
}

const fundTransferSchema = new Schema<IFundTransfer>(
  {
    date: { type: Date, required: true },
    supervisor: { type: Schema.Types.ObjectId, ref: "User" },
    location: { type: String },
    amount: { type: Number, required: true },
    mode: { type: String },
    remark: { type: String }
  },
  { timestamps: true }
);

export const FundTransfer = mongoose.model<IFundTransfer>(
  "FundTransfer",
  fundTransferSchema
);