import { Request, Response } from "express";
import mongoose from "mongoose";
import { Worker as WorkerModel } from "../models/worker.model";
import { Attendance } from "../models/attendance.model";
import { WorkerAttendance } from "../models/workerAttendance.model";
import { User } from "../models/user.model";

export const markWorkerAttendance = async (req: Request, res: Response) => {
    try {
        const { workerId, date, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({ message: "Invalid worker ID" });
        }

        if (!date || !status) {
            return res.status(400).json({
                message: "Date and status are required",
            });
        }

        const worker = await WorkerModel.findById(workerId);

        if (!worker) {
            return res.status(404).json({
                message: "Worker not found",
            });
        }

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const attendance = await WorkerAttendance.findOneAndUpdate(
            {
                worker: workerId,
                date: attendanceDate,
            },
            {
                worker: workerId,
                date: attendanceDate,
                status,
            },
            {
                new: true,
                upsert: true,
            }
        );

        return res.status(200).json({
            message: "Worker attendance saved successfully",
            data: attendance,
        });

    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getWorkerAttendanceByDate = async (
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

        const attendanceList = await WorkerAttendance.find({
            date: {
                $gte: selectedDate,
                $lt: nextDate,
            },
        }).populate("worker", "name mobile");

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

export const getWorkerHistory = async (
    req: Request<{ workerId: string }>,
    res: Response
) => {
    try {
        const { workerId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({
                message: "Invalid worker ID",
            });
        }

        const attendance = await WorkerAttendance.find({
            worker: workerId,
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

export const searchWorker = async (
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

        const workers = await WorkerModel.find({
            name: { $regex: keyword, $options: "i" },
            // isActive: true
        }).select("name mobile");

        return res.status(200).json({
            total: workers.length,
            data: workers,
        });

    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteWorkerAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        const { workerId, date } = req.body;

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        await WorkerAttendance.findOneAndDelete({
            worker: workerId,
            date: attendanceDate,
        });

        return res.status(200).json({
            message: "Worker attendance deleted successfully",
        });

    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};