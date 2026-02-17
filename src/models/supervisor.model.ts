import mongoose from "mongoose";

const supervisorSchema = new mongoose.Schema(
  {
    supervisorId: {
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

export const Supervisor = mongoose.model("Supervisor", supervisorSchema);
