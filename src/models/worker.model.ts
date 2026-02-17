import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    workerId: {
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

export const Worker = mongoose.model("Worker", workerSchema);
