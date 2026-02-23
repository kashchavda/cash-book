import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "supervisor" | "sub-admin" | "worker";

  password: string;
  profilePhoto?: string;
  // isActive?: boolean;

  // ===== Address Info =====
  state?: string;
  city?: string;
  address?: string;
  countryCode?: string;

  // ===== Common Personal Info =====
  bloodGroup?: string;
  relationship?: string;

  // ===== Employment Info (Supervisor + Worker) =====
  joiningDate?: Date;
  salary?: number;
  salaryFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  skillType?: string;
  pincode?: string;
  guardianName?: string;
  guardianMobile?: string;
  relation?: string;
  //OTP Authentication
  otp?: string | null;
  otpExpire?: Date | null;
  otpVerified?: boolean;

  //Email Change
  emailChangeOtp?: string | null;
  emailChangeOtpExpiry?: Date | null;
  pendingNewEmail?: string | null;

  //Notification Settings
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
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["admin", "user", "supervisor", "sub-admin", "worker"],
      default: "user",
    },

    // isActive: {
    //   type: Boolean,
    //   default: true
    // },

    password: {
      type: String,
      required: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    // Address
    state: String,
    city: String,
    address: String,
    countryCode: String,

    bloodGroup: String,
    relationship: String,

    joiningDate: Date,
    salary: Number,
    salaryFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },

    // Worker Fields
    skillType: String,
    pincode: String,

    guardianName: String,
    guardianMobile: String,
    relation: String,

    // OTP
    otp: { type: String, default: null },
    otpExpire: { type: Date, default: null },
    otpVerified: { type: Boolean, default: false },

    // Email Change
    emailChangeOtp: { type: String, default: null },
    emailChangeOtpExpiry: { type: Date, default: null },
    pendingNewEmail: { type: String, default: null },

    // Notifications
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