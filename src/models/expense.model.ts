import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  date: Date;
  supervisor: mongoose.Types.ObjectId;
  location: string;
  vendor: mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: string;
  items: string;
}

const expenseSchema = new Schema<IExpense>(
  {
    date: { type: Date, required: true },
    supervisor: { type: Schema.Types.ObjectId, ref: "User" },
    location: { type: String },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Paid", "Unpaid"] },
    items: { type: String }
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>("Expense", expenseSchema);