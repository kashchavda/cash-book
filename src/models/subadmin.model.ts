import mongoose from "mongoose";

const subAdminSchema = new mongoose.Schema(
  {
    subAdminId: {
      type: String,
      unique: true
    },

    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },

    // Salary
    salary: {
      type: Number,
      required: true
    },
    salaryType: {
      type: String,
      enum: ["Monthly", "Daily", "Weekly"],
      required: true
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },

    // Address
    pincode: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },

    // Emergency Contact
    guardianName: {
      type: String,
      required: true
    },
    guardianPhone: {
      type: String,
      required: true
    },
    relation: {
      type: String,
      required: true
    },

    // Status
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const SubAdmin = mongoose.model("SubAdmin", subAdminSchema);