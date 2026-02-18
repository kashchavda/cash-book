import { Request, Response } from "express";
import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model";
import { Location } from "../models/location.model";
import { Supervisor } from "../models/supervisor.model";
import { createNotification } from "../services/notification.service";
import path from "path";
import fs from "fs";

// ===================== CREATE TRANSACTION =====================
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const {
      type,
      amount,
      description,
      supervisorId,
      locationId,
      status,
      transferLocationId
    } = req.body;

    if (!type || amount === undefined || !supervisorId || !locationId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    // CREDIT OR DEBIT
    if (type === "credit" || type === "debit") {
      const transaction = await Transaction.create({
        type,
        amount,
        description,
        supervisorId,
        locationId,
        status
      });

      await createNotification(
        "New transaction added",
        `New ${type} entry of ₹${amount} added at ${location.name}`,
        "transaction"
      );

      return res.status(201).json({
        message: "Transaction created successfully",
        data: transaction
      });
    }

    // INTERNAL TRANSFER
    if (type === "internal_transfer") {
      if (!transferLocationId) {
        return res.status(400).json({
          message: "transferLocationId is required for internal transfer"
        });
      }

      const transferLocation = await Location.findById(transferLocationId);
      if (!transferLocation) {
        return res.status(404).json({ message: "Transfer location not found" });
      }

      const transferId = new mongoose.Types.ObjectId().toString();

      const debitTransaction = await Transaction.create({
        type: "debit",
        amount,
        description: description || `Transferred to ${transferLocation.name}`,
        supervisorId,
        locationId,
        status: "paid",
        transferLocationId,
        transferId
      });

      const creditTransaction = await Transaction.create({
        type: "credit",
        amount,
        description: description || `Received from ${location.name}`,
        supervisorId,
        locationId: transferLocationId,
        status: "paid",
        transferLocationId: locationId,
        transferId
      });

      await createNotification(
        "Internal Transfer Completed",
        `₹${amount} transferred from ${location.name} to ${transferLocation.name}`,
        "transaction"
      );

      return res.status(201).json({
        message: "Internal transfer completed successfully",
        data: {
          debitTransaction,
          creditTransaction
        }
      });
    }

    return res.status(400).json({
      message: "Invalid type. Use credit, debit, internal_transfer"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ===================== GET ALL TRANSACTIONS =====================
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find()
      .populate("supervisorId", "supervisorId name mobile email")
      .populate("locationId", "name address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Transactions fetched successfully",
      total: transactions.length,
      data: transactions
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ===================== GET TRANSACTIONS BY LOCATION =====================
export const getTransactionsByLocation = async (req: Request, res: Response) => {
  try {
    const { locationId } = req.params;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const transactions = await Transaction.find({ locationId })
      .populate("supervisorId", "supervisorId name mobile email")
      .populate("locationId", "name address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: `Transactions fetched for location: ${location.name}`,
      total: transactions.length,
      data: transactions
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ===================== UPDATE TRANSACTION =====================
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, amount, description, supervisorId, locationId, status } =
      req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.type = type || transaction.type;
    transaction.amount = amount ?? transaction.amount;
    transaction.description = description || transaction.description;
    transaction.supervisorId = supervisorId || transaction.supervisorId;
    transaction.locationId = locationId || transaction.locationId;
    transaction.status = status || transaction.status;

    await transaction.save();

    await createNotification(
      "Transaction updated",
      `Transaction updated successfully (Amount: ₹${transaction.amount})`,
      "transaction"
    );

    return res.status(200).json({
      message: "Transaction updated successfully",
      data: transaction
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ===================== UPLOAD TRANSACTION ATTACHMENT =====================
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

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    let fileType: "image" | "pdf" | "none" = "none";

    if (req.file.mimetype.startsWith("image/")) fileType = "image";
    else if (req.file.mimetype === "application/pdf") fileType = "pdf";

    // delete old file if exists
    if (transaction.attachmentUrl) {
      const parts = transaction.attachmentUrl.split("/uploads/");
      if (parts.length > 1) {
        const oldFilename = parts[1];
        const oldFilePath = path.join(process.cwd(), "uploads", oldFilename);

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    transaction.attachmentUrl = fileUrl;
    transaction.attachmentType = fileType;

    await transaction.save();

    return res.status(200).json({
      message: "Attachment uploaded successfully",
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

// ===================== GET TRANSACTION ATTACHMENT =====================
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

// ===================== DOWNLOAD TRANSACTION ATTACHMENT =====================
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

    const parts = transaction.attachmentUrl.split("/uploads/");

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

// ===================== DELETE TRANSACTION (WITH FILE DELETE) =====================
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // delete attachment file if exists
    if (transaction.attachmentUrl) {
      const parts = transaction.attachmentUrl.split("/uploads/");
      if (parts.length > 1) {
        const filename = parts[1];
        const filePath = path.join(process.cwd(), "uploads", filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await Transaction.findByIdAndDelete(id);

    await createNotification(
      "Transaction deleted",
      `A transaction was deleted (Amount: ₹${transaction.amount})`,
      "transaction"
    );

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
