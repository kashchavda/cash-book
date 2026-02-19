import mongoose, { Schema } from "mongoose";

const businessLocationSchema = new Schema(
  {
    locationName: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    landmark: { type: String, default: "" }
  },
  { timestamps: true }
);

const businessSchema = new Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    businessName: { type: String, required: true },
    businessCategory: { type: String, required: true },

    country: { type: String, required: true }, // Location (Country)
    gstn: { type: String, required: true },

    phone: { type: String, default: "" },

    businessPhoto: { type: String, default: "" },

    locations: [businessLocationSchema]
  },
  { timestamps: true }
);

export const Business = mongoose.model("Business", businessSchema);
