import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  role: string;

  password: string;

  profilePhoto?: string;

  otp?: string | null;
  otpExpire?: Date | null;
  otpVerified?: boolean;

  // change email otp
  emailChangeOtp?: string | null;
  emailChangeOtpExpiry?: Date | null;
  pendingNewEmail?: string | null;

  // notification settings
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

    role: { type: String, default: "user" },

    password: { type: String, required: true },

    profilePhoto: { type: String, default: "" },

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
      attendanceUpdates: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
