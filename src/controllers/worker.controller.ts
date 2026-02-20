import { Request, Response } from "express";
import mongoose from "mongoose";
import { Worker } from "../models/worker.model";
import { createNotification } from "../services/notification.service";

export const createWorker = async (req: Request, res: Response) => {
  try {
    const {
      name,
      mobile,
      email,
      skillType,
      pincode,
      city,
      state,
      bloodGroup,
      salary,
      salaryType,
      guardianName,
      guardianMobile,
      relation
    } = req.body;

    // Validate Required Fields
    if (
      !name || !mobile || !email || !skillType ||
      !pincode || !city || !state ||
      !bloodGroup || !salary ||
      !guardianName || !guardianMobile || !relation
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check duplicate email
    const existing = await Worker.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Auto generate workerId
    const count = await Worker.countDocuments();
    const workerId = "W" + (count + 1).toString().padStart(3, "0");

    const worker = await Worker.create({
      workerId,
      name,
      mobile,
      email,
      skillType,
      pincode,
      city,
      state,
      bloodGroup,
      salary,
      salaryType,
      guardianName,
      guardianMobile,
      relation
    });

    await createNotification(
      "New Worker Created",
      `Worker ${worker.name} (${worker.workerId}) added`,
      "worker"
    );

    return res.status(201).json({
      message: "Worker created successfully",
      data: worker
    });

  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getAllWorkers = async (_req: Request, res: Response) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });

    return res.status(200).json({
      total: workers.length,
      data: workers
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getWorkerById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid worker ID" });
    }

    const worker = await Worker.findById(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    return res.status(200).json({ data: worker });

  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const updateWorker = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid worker ID" });
    }

    const worker = await Worker.findById(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    Object.assign(worker, req.body);
    await worker.save();

    await createNotification(
      "Worker Updated",
      `Worker ${worker.name} updated`,
      "worker"
    );

    return res.status(200).json({
      message: "Worker updated successfully",
      data: worker
    });

  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteWorker = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid worker ID" });
    }

    const worker = await Worker.findByIdAndDelete(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    await createNotification(
      "Worker Deleted",
      `Worker ${worker.name} deleted`,
      "worker"
    );

    return res.status(200).json({
      message: "Worker deleted successfully"
    });

  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};