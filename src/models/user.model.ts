import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "supervisor" | "sub-admin";
  password: string;
  profilePhoto?: string;

  // supervisor extra fields
  state?: string;
  city?: string;
  address?: string;
  bloodGroup?: string;
  joiningDate?: Date;
  salaryFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  relationship?: string;
  countryCode?: string;

  otp?: string | null;
  otpExpire?: Date | null;
  otpVerified?: boolean;

  emailChangeOtp?: string | null;
  emailChangeOtpExpiry?: Date | null;
  pendingNewEmail?: string | null;

  notificationSettings: {
    enableAllNotifications: boolean;
    enableSalesAlerts: boolean;
    fundTransactionAlerts: boolean;
    newBillEntries: boolean;
    attendanceUpdates: boolean;
  };
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, default: "" },

    email: { type: String, required: true, unique: true },

    phone: { type: String, default: "" },

    role: {
      type: String,
      enum: ["admin", "user", "supervisor", "sub-admin"],
      default: "user",
    },

    password: { type: String, required: true },

    profilePhoto: { type: String, default: "" },

    // supervisor fields
    state: { type: String },
    city: { type: String },
    address: { type: String },
    bloodGroup: { type: String },
    joiningDate: { type: Date },
    salaryFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    relationship: { type: String },
    countryCode: { type: String },

    otp: { type: String, default: null },
    otpExpire: { type: Date, default: null },
    otpVerified: { type: Boolean, default: false },

    emailChangeOtp: { type: String, default: null },
    emailChangeOtpExpiry: { type: Date, default: null },
    pendingNewEmail: { type: String, default: null },

    notificationSettings: {
      enableAllNotifications: { type: Boolean, default: true },
      enableSalesAlerts: { type: Boolean, default: true },
      fundTransactionAlerts: { type: Boolean, default: true },
      newBillEntries: { type: Boolean, default: true },
      attendanceUpdates: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);