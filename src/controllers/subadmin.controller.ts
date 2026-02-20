import { Request, Response } from "express";
import { SubAdmin } from "../models/subadmin.model";

export const createSubAdmin = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      salary,
      salaryType,
      joiningDate,
      pincode,
      city,
      state,
      guardianName,
      guardianPhone,
      relation
    } = req.body;

    // Validation
    if (
      !name || !email || !phone || !salary || !salaryType ||
      !pincode || !city || !state ||
      !guardianName || !guardianPhone || !relation
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Duplicate check
    const existing = await SubAdmin.findOne({
      $or: [{ email }, { phone }]
    });

    if (existing) {
      return res.status(400).json({
        message: "Email or Phone already exists"
      });
    }

    // Generate ID
    const last = await SubAdmin.findOne().sort({ createdAt: -1 });

    let newNumber = 1;
    if (last?.subAdminId) {
      const lastNumber = parseInt(last.subAdminId.replace("A", ""));
      newNumber = lastNumber + 1;
    }

    const subAdminId = "A" + newNumber.toString().padStart(3, "0");

    const subAdmin = await SubAdmin.create({
      subAdminId,
      name,
      email,
      phone,
      salary,
      salaryType,
      joiningDate,
      pincode,
      city,
      state,
      guardianName,
      guardianPhone,
      relation
    });

    res.status(201).json({
      message: "Sub Admin created successfully",
      data: subAdmin
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

export const getAllSubAdmins = async (req: Request, res: Response) => {
  try {
    const subAdmins = await SubAdmin.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: subAdmins.length,
      data: subAdmins
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubAdminById = async (req: Request, res: Response) => {
  try {
    const subAdmin = await SubAdmin.findById(req.params.id);

    if (!subAdmin) {
      return res.status(404).json({ message: "Sub Admin not found" });
    }

    res.status(200).json({ data: subAdmin });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubAdmin = async (req: Request, res: Response) => {
  try {
    const updated = await SubAdmin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Sub Admin not found" });
    }

    res.status(200).json({
      message: "Updated successfully",
      data: updated
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubAdmin = async (req: Request, res: Response) => {
  try {
    const deleted = await SubAdmin.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Sub Admin not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleStatus = async (req: Request, res: Response) => {
  try {
    const subAdmin = await SubAdmin.findById(req.params.id);

    if (!subAdmin) {
      return res.status(404).json({ message: "Sub Admin not found" });
    }

    subAdmin.status = !subAdmin.status;
    await subAdmin.save();

    res.status(200).json({
      message: "Status updated",
      data: subAdmin
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};