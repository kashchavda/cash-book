import { Request, Response } from "express";
import { Worker } from "../models/worker.model";
import { createNotification } from "../services/notification.service";

export const createWorker = async (req: Request, res: Response) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Worker.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const lastWorker = await Worker.findOne().sort({ createdAt: -1 });

    let newNumber = 1;

    if (lastWorker?.workerId) {
      const lastNumber = parseInt(lastWorker.workerId.replace("W", ""));
      newNumber = lastNumber + 1;
    }

    const workerId = "W" + newNumber.toString().padStart(3, "0");

    const worker = await Worker.create({
      workerId,
      name,
      mobile,
      email
    });

    await createNotification(
      "New worker created",
      `New worker added: ${worker.name} (${worker.workerId})`,
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

export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Workers fetched successfully",
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

export const getWorkerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const worker = await Worker.findById(id);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    return res.status(200).json({
      message: "Worker fetched successfully",
      data: worker
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const updateWorker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, mobile, email } = req.body;

    const worker = await Worker.findById(id);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    if (email) {
      const existing = await Worker.findOne({ email, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    worker.name = name || worker.name;
    worker.mobile = mobile || worker.mobile;
    worker.email = email || worker.email;

    await worker.save();

    await createNotification(
      "Worker updated",
      `Worker updated: ${worker.name} (${worker.workerId})`,
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

export const deleteWorker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const worker = await Worker.findById(id);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    await Worker.findByIdAndDelete(id);

    await createNotification(
      "Worker deleted",
      `Worker deleted: ${worker.name} (${worker.workerId})`,
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
