import { Request, Response } from "express";
import { SubAdmin } from "../models/subadmin.model";
import { createNotification } from "../services/notification.service";

export const createSubAdmin = async (req: Request, res: Response) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const lastSubAdmin = await SubAdmin.findOne().sort({ createdAt: -1 });

    let newNumber = 1;
    if (lastSubAdmin?.subAdminId) {
      const lastNumber = parseInt(lastSubAdmin.subAdminId.replace("A", ""));
      newNumber = lastNumber + 1;
    }

    const subAdminId = "A" + newNumber.toString().padStart(3, "0");

    const subAdmin = await SubAdmin.create({
      subAdminId,
      name,
      mobile,
      email
    });

    await createNotification(
      "New sub admin added",
      `New sub admin account created: ${subAdmin.name}`,
      "sub_admin"
    );

    return res.status(201).json({
      message: "Sub Admin created successfully",
      data: subAdmin
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getAllSubAdmins = async (req: Request, res: Response) => {
  try {
    const subAdmins = await SubAdmin.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Sub Admins fetched successfully",
      total: subAdmins.length,
      data: subAdmins
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getSubAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subAdmin = await SubAdmin.findById(id);

    if (!subAdmin) {
      return res.status(404).json({ message: "Sub Admin not found" });
    }

    return res.status(200).json({
      message: "Sub Admin fetched successfully",
      data: subAdmin
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const updateSubAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, mobile, email } = req.body;

    const subAdmin = await SubAdmin.findById(id);

    if (!subAdmin) {
      return res.status(404).json({ message: "Sub Admin not found" });
    }

    subAdmin.name = name || subAdmin.name;
    subAdmin.mobile = mobile || subAdmin.mobile;
    subAdmin.email = email || subAdmin.email;

    await subAdmin.save();

    await createNotification(
      "Sub Admin updated",
      `Sub admin updated: ${subAdmin.name}`,
      "sub_admin"
    );

    return res.status(200).json({
      message: "Sub Admin updated successfully",
      data: subAdmin
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteSubAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subAdmin = await SubAdmin.findById(id);

    if (!subAdmin) {
      return res.status(404).json({ message: "Sub Admin not found" });
    }

    await SubAdmin.findByIdAndDelete(id);

    await createNotification(
      "Sub Admin deleted",
      `Sub admin deleted: ${subAdmin.name}`,
      "sub_admin"
    );

    return res.status(200).json({
      message: "Sub Admin deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
