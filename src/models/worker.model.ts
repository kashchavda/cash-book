import mongoose, { Schema, Document } from "mongoose";

export interface IWorker extends Document {
  workerId: string;
  role?: "worker";
  name: string;
  mobile: string;
  email: string;
  skillType?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  pincode?: string;
  city?: string;
  state?: string;
  bloodGroup?: string;
  salary?: number;
  salaryType?: "daily" | "weekly" | "monthly" | "yearly";
  guardianName?: string;
  guardianMobile?: string;
  relation?: string;
}

const workerSchema = new Schema<IWorker>(
  {
    workerId: {
      type: String,
      unique: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    mobile: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    role: {
      type: String,
      default: "worker"
    },

    skillType: {
      type: String
    },

    pincode: String,
    city: String,
    state: String,
    bloodGroup: String,

    salary: Number,

    salaryType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly"
    },

    guardianName: String,
    guardianMobile: String,
    relation: String,

    // Status Fields
    isActive: {
      type: Boolean,
      default: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Worker = mongoose.model<IWorker>("Worker", workerSchema);