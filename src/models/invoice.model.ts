import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    invoiceDate: {
      type: Date,
      default: Date.now
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location"
    }
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
