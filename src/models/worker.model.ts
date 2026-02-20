import mongoose, { Schema, Document } from "mongoose";

export interface IWorker extends Document {
  workerId: string;

  // Personal Info
  name: string;
  mobile: string;
  email: string;
  skillType: string;

  // Address
  pincode: string;
  city: string;
  state: string;

  // Other Details
  bloodGroup: string;
  salary: number;
  salaryType: string;

  // Guardian Details
  guardianName: string;
  guardianMobile: string;
  relation: string;
}

const workerSchema = new Schema<IWorker>(
  {
    workerId: {
      type: String,
      unique: true,
      index: true
    },

    // Personal Info
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
    skillType: {
      type: String,
      required: true
    },

    // Address
    pincode: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },

    // Other
    bloodGroup: {
      type: String,
      required: true
    },
    salary: {
      type: Number,
      required: true
    },
    salaryType: {
      type: String,
      enum: ["Monthly", "Daily"],
      default: "Monthly"
    },

    // Guardian
    guardianName: {
      type: String,
      required: true
    },
    guardianMobile: {
      type: String,
      required: true
    },
    relation: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Worker = mongoose.model<IWorker>("Worker", workerSchema);