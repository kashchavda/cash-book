import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      unique: true
    },

    // Business Info
    name: {
      type: String,
      required: true,
      trim: true
    },
    contactPerson: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },

    // Contact
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    // KYC
    gstNumber: {
      type: String
    },
    panNumber: {
      type: String
    },
    aadhaarNumber: {
      type: String
    },
    upiId: {
      type: String
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
    buildingName: {
      type: String
    },
    landmark: {
      type: String
    },

    // Status
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Vendor = mongoose.model("Vendor", vendorSchema);