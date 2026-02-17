import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    address: {
      type: String
    },

    latitude: {
      type: Number
    },

    longitude: {
      type: Number
    }
  },
  { timestamps: true }
);

export const Location = mongoose.model("Location", locationSchema);
