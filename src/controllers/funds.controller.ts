import { Request, Response } from "express";
import { Fund } from "../models/fund.model";
import path from "path";
import fs from "fs";

export const createFund = async (req: Request, res: Response) => {
  try {
    const fund = await Fund.create(req.body);

    return res.status(201).json({
      message: "Fund created successfully",
      data: fund
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getAllFunds = async (req: Request, res: Response) => {
  try {
    const funds = await Fund.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Funds fetched successfully",
      data: funds
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getFundById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const fund = await Fund.findById(id);

    if (!fund) {
      return res.status(404).json({ message: "Fund not found" });
    }

    return res.status(200).json({
      message: "Fund fetched successfully",
      data: fund
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const updateFund = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const fund = await Fund.findByIdAndUpdate(id, req.body, { new: true });

    if (!fund) {
      return res.status(404).json({ message: "Fund not found" });
    }

    return res.status(200).json({
      message: "Fund updated successfully",
      data: fund
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// =================== Upload Attachment ===================

export const uploadFundAttachment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const fund = await Fund.findById(id);

    if (!fund) {
      return res.status(404).json({ message: "Fund not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Attachment file is required" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    let fileType: "image" | "pdf" | "none" = "none";

    if (req.file.mimetype.startsWith("image/")) fileType = "image";
    else if (req.file.mimetype === "application/pdf") fileType = "pdf";

    // delete old attachment if exists
    if (fund.attachmentUrl) {
      const parts = fund.attachmentUrl.split("/uploads/");
      if (parts.length > 1) {
        const oldFilename = parts[1];
        const oldPath = path.join(process.cwd(), "uploads", oldFilename);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    fund.attachmentUrl = fileUrl;
    fund.attachmentType = fileType;

    await fund.save();

    return res.status(200).json({
      message: "Attachment uploaded successfully",
      attachmentUrl: fund.attachmentUrl,
      attachmentType: fund.attachmentType
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const downloadFundAttachment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const fund = await Fund.findById(id);

    if (!fund) {
      return res.status(404).json({ message: "Fund not found" });
    }

    if (!fund.attachmentUrl) {
      return res.status(404).json({ message: "No attachment found" });
    }

    const parts = fund.attachmentUrl.split("/uploads/");

    if (parts.length < 2) {
      return res.status(400).json({ message: "Invalid attachment url" });
    }

    const filename = parts[1];
    const filePath = path.join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    return res.download(filePath);
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteFund = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const fund = await Fund.findById(id);

    if (!fund) {
      return res.status(404).json({ message: "Fund not found" });
    }

    // delete file from uploads folder
    if (fund.attachmentUrl) {
      const parts = fund.attachmentUrl.split("/uploads/");
      if (parts.length > 1) {
        const filename = parts[1];
        const filePath = path.join(process.cwd(), "uploads", filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await Fund.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Fund deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
