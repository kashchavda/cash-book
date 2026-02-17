import mongoose from "mongoose";

const subAdminSchema = new mongoose.Schema(
  {
    subAdminId: {
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

export const SubAdmin = mongoose.model("SubAdmin", subAdminSchema);
