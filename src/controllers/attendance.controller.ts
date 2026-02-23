import { Request, Response } from "express";
import mongoose from "mongoose";
import { Attendance } from "../models/attendance.model";
import { User } from "../models/user.model";

export const markAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const { supervisorId, date, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
      return res.status(400).json({ message: "Invalid supervisor ID" });
    }

    if (!date || !status) {
      return res.status(400).json({
        message: "Date and status are required",
      });
    }

    const supervisor = await User.findOne({
      _id: supervisorId,
      role: "supervisor",
    });

    if (!supervisor) {
      return res.status(404).json({
        message: "Supervisor not found",
      });
    }

    // Normalize date to start of day
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      {
        supervisor: supervisorId,
        date: attendanceDate,
      },
      {
        supervisor: supervisorId,
        date: attendanceDate,
        status,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      message: "Attendance saved successfully",
      data: attendance,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAttendanceByDate = async (
  req: Request,
  res: Response
) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const selectedDate = new Date(date as string);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const attendanceList = await Attendance.find({
      date: { $gte: selectedDate, $lt: nextDate },
    }).populate("supervisor", "name mobile");

    const totalPresent = attendanceList.filter(
      (item) => item.status === "present"
    ).length;

    return res.status(200).json({
      totalPresent,
      totalRecords: attendanceList.length,
      data: attendanceList,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAttendanceHistory = async (
  req: Request<{ supervisorId: string }>,
  res: Response
) => {
  try {
    const { supervisorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
      return res.status(400).json({
        message: "Invalid supervisor ID",
      });
    }

    const attendance = await Attendance.find({
      supervisor: supervisorId,
    }).sort({ date: -1 });

    return res.status(200).json({
      totalRecords: attendance.length,
      data: attendance,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const searchSupervisor = async (
  req: Request,
  res: Response
) => {
  try {
    const keyword = req.query.keyword as string;

    if (!keyword) {
      return res.status(400).json({
        message: "Search keyword is required",
      });
    }

    const supervisors = await User.find({
      role: "supervisor",
      name: {
        $regex: new RegExp(keyword, "i"), 
      },
    }).select("name mobile");

    return res.status(200).json({
      total: supervisors.length,
      data: supervisors,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const { supervisorId, date } = req.body;

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    await Attendance.findOneAndDelete({
      supervisor: supervisorId,
      date: attendanceDate,
    });

    return res.status(200).json({
      message: "Attendance deleted successfully",
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};