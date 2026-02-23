import mongoose, { Schema, Document } from "mongoose";

export interface IWorkerAttendance extends Document {
  worker: mongoose.Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "leave" | "holiday";
}

const workerAttendanceSchema = new Schema<IWorkerAttendance>(
  {
    worker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave", "holiday"],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate per worker per date
workerAttendanceSchema.index({ worker: 1, date: 1 }, { unique: true });

export const WorkerAttendance = mongoose.model<IWorkerAttendance>(
  "WorkerAttendance",
  workerAttendanceSchema
);