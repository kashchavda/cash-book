import { Request, Response } from "express";
import { Vendor } from "../models/vendor.model";
import { createNotification } from "../services/notification.service";

export const createVendor = async (req: Request, res: Response) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Vendor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const lastVendor = await Vendor.findOne().sort({ createdAt: -1 });

    let newNumber = 1;

    if (lastVendor?.vendorId) {
      const lastNumber = parseInt(lastVendor.vendorId.replace("V", ""));
      newNumber = lastNumber + 1;
    }

    const vendorId = "V" + newNumber.toString().padStart(3, "0");

    const vendor = await Vendor.create({
      vendorId,
      name,
      mobile,
      email
    });

    await createNotification(
      "New vendor added",
      `New vendor added: ${vendor.name}`,
      "vendor"
    );

    return res.status(201).json({
      message: "Vendor created successfully",
      data: vendor
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Vendors fetched successfully",
      total: vendors.length,
      data: vendors
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getVendorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res.status(200).json({
      message: "Vendor fetched successfully",
      data: vendor
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, mobile, email } = req.body;

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (email) {
      const existing = await Vendor.findOne({ email, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    vendor.name = name || vendor.name;
    vendor.mobile = mobile || vendor.mobile;
    vendor.email = email || vendor.email;

    await vendor.save();

    return res.status(200).json({
      message: "Vendor updated successfully",
      data: vendor
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    await Vendor.findByIdAndDelete(id);

    await createNotification(
      "Vendor deleted",
      `Vendor deleted: ${vendor.name}`,
      "vendor"
    );

    return res.status(200).json({
      message: "Vendor deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
