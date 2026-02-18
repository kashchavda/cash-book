import { Request, Response } from "express";
import mongoose from "mongoose";
import { Bill } from "../models/bill.model";
import path from "path";
import fs from "fs";

// ✅ Create Bill
export const createBill = async (req: Request, res: Response) => {
  try {
    const {
      contactName,
      locationId,
      supervisorId,
      billType,
      paymentMethod,
      paymentStatus,
      amountTotal,
      amountPaid,
      amountPending,
      description,
      billDate
    } = req.body;

    if (!contactName || !locationId || !supervisorId || !amountTotal || !billDate) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const bill = await Bill.create({
      contactName,
      locationId,
      supervisorId,
      billType,
      paymentMethod,
      paymentStatus,
      amountTotal,
      amountPaid,
      amountPending,
      description,
      billDate
    });

    return res.status(201).json({
      message: "Bill created successfully",
      data: bill
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ Get All Bills (Bills List)
export const getAllBills = async (req: Request, res: Response) => {
  try {
    const bills = await Bill.find()
      .populate("locationId", "name address")
      .populate("supervisorId", "name mobile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Bills fetched successfully",
      total: bills.length,
      data: bills
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ Get Bill Details
export const getBillDetails = async (req: Request, res: Response) => {
  try {
    const billId = req.params.billId as string;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(400).json({ message: "Invalid billId" });
    }

    const bill = await Bill.findById(billId)
      .populate("locationId", "name address")
      .populate("supervisorId", "name mobile email");

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    return res.status(200).json({
      message: "Bill details fetched successfully",
      data: bill
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ Upload Bill Attachment (Save file name in DB)
export const uploadBillAttachment = async (req: Request, res: Response) => {
  try {
    const billId = req.params.billId as string;

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();

    let attachmentType: "image" | "pdf" | "none" = "none";

    if (ext === ".pdf") attachmentType = "pdf";
    else if ([".jpg", ".jpeg", ".png"].includes(ext)) attachmentType = "image";

    bill.attachmentUrl = req.file.filename;
    bill.attachmentType = attachmentType;

    await bill.save();

    return res.status(200).json({
      message: "Bill attachment uploaded successfully",
      data: bill
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ View Bill Attachment (Open file)
export const viewBillAttachment = async (req: Request, res: Response) => {
  try {
    const billId = req.params.billId as string;

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (!bill.attachmentUrl) {
      return res.status(404).json({ message: "No attachment found" });
    }

    const filePath = path.join(__dirname, "../../uploads", bill.attachmentUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found in server" });
    }

    return res.sendFile(filePath);
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ Download Bill Attachment
export const downloadBillAttachment = async (req: Request, res: Response) => {
  try {
    const billId = req.params.billId as string;

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (!bill.attachmentUrl) {
      return res.status(404).json({ message: "No attachment found" });
    }

    const filePath = path.join(__dirname, "../../uploads", bill.attachmentUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found in server" });
    }

    return res.download(filePath);
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
