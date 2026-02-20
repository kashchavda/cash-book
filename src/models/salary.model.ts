import mongoose, { Schema, Document } from "mongoose";

export interface ISalary extends Document {
  supervisor: mongoose.Types.ObjectId;
  amount: number;
  month: number;
  year: number;
  paidDate?: Date;
}

const salarySchema = new Schema<ISalary>(
  {
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    paidDate: Date,
  },
  { timestamps: true }
);

// Prevent duplicate salary per supervisor per month/year
salarySchema.index(
  { supervisor: 1, month: 1, year: 1 },
  { unique: true }
);

export const Salary = mongoose.model<ISalary>("Salary", salarySchema);