import mongoose from "mongoose";

const itemEntrySchema = new mongoose.Schema(
  {
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    gst: { type: Number, default: 0 }
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },

    entries: {
      type: [itemEntrySchema],
      default: []
    }
  },
  { timestamps: true }
);

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["credit", "debit", "internal_transfer"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      default: null
    },

    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
      required: true
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },

    status: {
      type: String,
      enum: ["paid", "pending", "partial"],
      default: "paid"
    },

    attachmentUrl: {
      type: String,
      default: null
    },

    attachmentType: {
      type: String,
      enum: ["image", "pdf", "none"],
      default: "none"
    },

    transferLocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null
    },

    transferId: {
      type: String,
      default: null
    },

    // ITEMS FEATURE ADDED
    items: {
      type: [itemSchema],
      default: []
    }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
