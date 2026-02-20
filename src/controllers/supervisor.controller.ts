import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

export const createSupervisor = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      state,
      city,
      address,
      bloodGroup,
      joiningDate,
      salaryFrequency,
      relationship,
      countryCode,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const supervisor = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "supervisor",
      state,
      city,
      address,
      bloodGroup,
      joiningDate,
      salaryFrequency,
      relationship,
      countryCode,
    });

    res.status(201).json({
      message: "Supervisor created successfully",
      data: supervisor,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSupervisors = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query: any = { role: "supervisor" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const supervisors = await User.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: supervisors,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSupervisorById = async (req: Request, res: Response) => {
  try {
    const supervisor = await User.findOne({
      _id: req.params.id,
      role: "supervisor",
    });

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    res.status(200).json({ data: supervisor });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSupervisor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const supervisor = await User.findOne({
      _id: id,
      role: "supervisor",
    });

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Supervisor updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// SOFT DELETE SUPERVISOR
export const deleteSupervisor = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      role: "user",
    });

    res.status(200).json({ message: "Supervisor removed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};