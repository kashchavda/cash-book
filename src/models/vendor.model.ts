import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

export const Vendor = mongoose.model("Vendor", vendorSchema);
