import { Request, Response } from "express";
import { Admin } from "../models/admin.model";

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const admin = await Admin.create({
      name,
      mobile,
      email,
      password
    });

    return res.status(201).json({
      message: "Admin created successfully",
      data: admin
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
