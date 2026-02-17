import { Request, Response } from "express";
import { Supervisor } from "../models/supervisor.model";
import { createNotification } from "../services/notification.service";

export const createSupervisor = async (req: Request, res: Response) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Supervisor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const lastSupervisor = await Supervisor.findOne().sort({ createdAt: -1 });

    let newNumber = 1;

    if (lastSupervisor?.supervisorId) {
      const lastNumber = parseInt(lastSupervisor.supervisorId.replace("S", ""));
      newNumber = lastNumber + 1;
    }

    const supervisorId = "S" + newNumber.toString().padStart(3, "0");

    const supervisor = await Supervisor.create({
      supervisorId,
      name,
      mobile,
      email
    });

    await createNotification(
      "New supervisor created",
      `New supervisor account created: ${supervisor.name} (${supervisor.supervisorId})`,
      "supervisor"
    );

    return res.status(201).json({
      message: "Supervisor created successfully",
      data: supervisor
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getAllSupervisors = async (req: Request, res: Response) => {
  try {
    const supervisors = await Supervisor.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Supervisors fetched successfully",
      total: supervisors.length,
      data: supervisors
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getSupervisorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const supervisor = await Supervisor.findById(id);

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    return res.status(200).json({
      message: "Supervisor fetched successfully",
      data: supervisor
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const updateSupervisor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, mobile, email } = req.body;

    const supervisor = await Supervisor.findById(id);

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    if (email) {
      const existing = await Supervisor.findOne({ email, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    supervisor.name = name || supervisor.name;
    supervisor.mobile = mobile || supervisor.mobile;
    supervisor.email = email || supervisor.email;

    await supervisor.save();

    await createNotification(
      "Supervisor updated",
      `Supervisor updated: ${supervisor.name} (${supervisor.supervisorId})`,
      "supervisor"
    );

    return res.status(200).json({
      message: "Supervisor updated successfully",
      data: supervisor
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteSupervisor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const supervisor = await Supervisor.findById(id);

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    await Supervisor.findByIdAndDelete(id);

    await createNotification(
      "Supervisor deleted",
      `Supervisor deleted: ${supervisor.name} (${supervisor.supervisorId})`,
      "supervisor"
    );

    return res.status(200).json({
      message: "Supervisor deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
