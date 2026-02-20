import { Request, Response } from "express";
import mongoose from "mongoose";
import { Attendance } from "../models/attendance.model";
import { User } from "../models/user.model";

// MARK ATTENDANCE
export const markAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const { supervisorId, date, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
      return res.status(400).json({ message: "Invalid supervisor ID" });
    }

    const supervisor = await User.findOne({
      _id: supervisorId,
      role: "supervisor",
    });

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    if (!date || !status) {
      return res.status(400).json({
        message: "Date and status are required",
      });
    }

    const attendance = await Attendance.create({
      supervisor: supervisorId,
      date,
      status,
    });

    return res.status(201).json({
      message: "Attendance marked successfully",
      data: attendance,
    });

  } catch (error: any) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance already marked for this date",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET ATTENDANCE HISTORY
export const getAttendance = async (
  req: Request<{ supervisorId: string }>,
  res: Response
) => {
  try {
    const { supervisorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
      return res.status(400).json({ message: "Invalid supervisor ID" });
    }

    const attendance = await Attendance.find({
      supervisor: supervisorId,
    }).sort({ date: -1 });

    return res.status(200).json({
      data: attendance,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};