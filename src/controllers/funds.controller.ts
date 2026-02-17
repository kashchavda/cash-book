import { Request, Response } from "express";
import { Transaction } from "../models/transaction.model";
import path from "path";
import fs from "fs";

export const uploadTransactionAttachment = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Attachment file is required" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    let fileType: "image" | "pdf" | "none" = "none";
    if (req.file.mimetype.includes("image")) fileType = "image";
    if (req.file.mimetype.includes("pdf")) fileType = "pdf";

    transaction.attachmentUrl = fileUrl;
    transaction.attachmentType = fileType;

    await transaction.save();

    return res.status(200).json({
      message: "Attachment uploaded successfully",
      data: transaction
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getTransactionAttachment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!transaction.attachmentUrl) {
      return res.status(404).json({ message: "No attachment found" });
    }

    return res.status(200).json({
      message: "Attachment fetched successfully",
      attachmentUrl: transaction.attachmentUrl,
      attachmentType: transaction.attachmentType
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const downloadTransactionAttachment = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!transaction.attachmentUrl) {
      return res.status(404).json({ message: "No attachment found" });
    }

    const filename = transaction.attachmentUrl.split("/uploads/")[1];

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

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // delete file from uploads folder also
    if (transaction.attachmentUrl) {
      const filename = transaction.attachmentUrl.split("/uploads/")[1];
      const filePath = path.join(process.cwd(), "uploads", filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Transaction.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Transaction deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
