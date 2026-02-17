import mongoose from "mongoose";

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
      type: String
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

    // ✅ ADD THESE TWO FIELDS
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

export const Transaction = mongoose.model("Transaction", transactionSchema);
