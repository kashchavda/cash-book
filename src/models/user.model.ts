import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  otp?: string | null;
  otpExpire?: Date | null;
  otpVerified?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    otp: { type: String, default: null },
    otpExpire: { type: Date, default: null },
    otpVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
