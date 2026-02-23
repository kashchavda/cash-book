import mongoose, { Schema, Document } from "mongoose";

export interface IBankAccount extends Document {
  user: mongoose.Types.ObjectId;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
}

const bankAccountSchema = new Schema<IBankAccount>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true
    },
    bankName: {
      type: String,
      required: true,
      trim: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    ifscCode: {
      type: String,
      required: true
    },
    accountType: {
      type: String,
      enum: ["Savings", "Current"],
      default: "Savings"
    }
  },
  { timestamps: true }
);

export const BankAccount = mongoose.model<IBankAccount>(
  "BankAccount",
  bankAccountSchema
);