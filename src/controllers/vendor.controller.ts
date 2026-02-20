import { Request, Response } from "express";
import { Vendor } from "../models/vendor.model";
import { createNotification } from "../services/notification.service";

export const createVendor = async (req: Request, res: Response) => {
  try {
    const {
      name,
      contactPerson,
      category,
      mobile,
      email,
      gstNumber,
      panNumber,
      aadhaarNumber,
      upiId,
      pincode,
      city,
      state,
      buildingName,
      landmark
    } = req.body;

    if (
      !name || !contactPerson || !category ||
      !mobile || !email ||
      !pincode || !city || !state
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existing = await Vendor.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existing) {
      return res.status(400).json({
        message: "Email or Mobile already exists"
      });
    }

    // Generate vendorId
    const last = await Vendor.findOne().sort({ createdAt: -1 });

    let newNumber = 1;
    if (last?.vendorId) {
      const lastNumber = parseInt(last.vendorId.replace("V", ""));
      newNumber = lastNumber + 1;
    }

    const vendorId = "V" + newNumber.toString().padStart(3, "0");

    const vendor = await Vendor.create({
      vendorId,
      name,
      contactPerson,
      category,
      mobile,
      email,
      gstNumber,
      panNumber,
      aadhaarNumber,
      upiId,
      pincode,
      city,
      state,
      buildingName,
      landmark
    });

    await createNotification(
      "Vendor Added",
      `Vendor created: ${vendor.name}`,
      "vendor"
    );

    res.status(201).json({
      message: "Vendor created successfully",
      data: vendor
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: vendors.length,
      data: vendors
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getVendorById = async (req: Request, res: Response) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ data: vendor });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "Vendor updated successfully",
      data: updated
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const deleted = await Vendor.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    await createNotification(
      "Vendor Deleted",
      `Vendor deleted: ${deleted.name}`,
      "vendor"
    );

    res.status(200).json({
      message: "Vendor deleted successfully"
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleVendorStatus = async (req: Request, res: Response) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.status = !vendor.status;
    await vendor.save();

    res.status(200).json({
      message: "Status updated",
      data: vendor
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};