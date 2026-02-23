import mongoose, { Schema, Document } from "mongoose";

export interface IVendorBill extends Document {
  vendor: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  billDate: Date;
}

const vendorBillSchema = new Schema(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: String,
    billDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const VendorBill = mongoose.model<IVendorBill>(
  "VendorBill",
  vendorBillSchema
);