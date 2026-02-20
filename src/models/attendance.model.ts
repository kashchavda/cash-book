import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  supervisor: mongoose.Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "leave" | "holiday";
}

const attendanceSchema = new Schema<IAttendance>(
  {
    supervisor: {
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

//Prevent duplicate attendance per supervisor per date
attendanceSchema.index({ supervisor: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>(
  "Attendance",
  attendanceSchema
);