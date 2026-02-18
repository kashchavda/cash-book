import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    contactName: {
      type: String,
      required: true
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },

    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
      required: true
    },

    billType: {
      type: String,
      enum: ["purchase", "expense"],
      default: "expense"
    },

    amountTotal: {
      type: Number,
      required: true
    },

    amountPaid: {
      type: Number,
      default: 0
    },

    amountPending: {
      type: Number,
      default: 0
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "partial"],
      default: "pending"
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "bank", "cheque", "other"],
      default: "cash"
    },

    description: {
      type: String,
      default: null
    },

    billDate: {
      type: Date,
      required: true
    },

    attachmentUrl: {
      type: String,
      default: null
    },

    attachmentType: {
      type: String,
      enum: ["image", "pdf", "none"],
      default: "none"
    }
  },
  { timestamps: true }
);

export const Bill = mongoose.model("Bill", billSchema);
