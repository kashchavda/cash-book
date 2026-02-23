import { Request, Response } from "express";
import mongoose from "mongoose";
import { BankAccount } from "../models/bankAccount.model";

export const createBankAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const {
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      accountType
    } = req.body;

    if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const account = await BankAccount.create({
      user: userId,
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      accountType
    });

    return res.status(201).json({
      message: "Bank account added successfully",
      account
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getBankAccounts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const accounts = await BankAccount.find({ user: userId }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      count: accounts.length,
      accounts
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getSingleBankAccount = async (
  req: Request,
  res: Response
) => {
  try {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(idParam)) {
      return res.status(400).json({ message: "Invalid account ID format" });
    }

    const account = await BankAccount.findById(idParam);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updateBankAccount = async (
  req: Request,
  res: Response
) => {
  try {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(idParam)) {
      return res.status(400).json({ message: "Invalid account ID format" });
    }

    const updated = await BankAccount.findByIdAndUpdate(
      idParam,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).json({
      message: "Bank account updated successfully",
      account: updated
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteBankAccount = async (
  req: Request,
  res: Response
) => {
  try {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(idParam)) {
      return res.status(400).json({ message: "Invalid account ID format" });
    }

    const deleted = await BankAccount.findByIdAndDelete(idParam);

    if (!deleted) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).json({
      message: "Bank account deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};