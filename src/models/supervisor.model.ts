import mongoose from "mongoose";

const supervisorSchema = new mongoose.Schema(
  {
    supervisorId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    mobile: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Keep only this if needed for sorting performance
supervisorSchema.index({ createdAt: -1 });

export const Supervisor = mongoose.model("Supervisor", supervisorSchema);