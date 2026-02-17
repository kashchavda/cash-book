import { Request, Response } from "express";
import { Transaction } from "../models/transaction.model";
import { Location } from "../models/location.model";
import { Supervisor } from "../models/supervisor.model";
import { createNotification } from "../services/notification.service";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { type, amount, description, supervisorId, locationId, status } =
      req.body;

    // validation
    if (!type || amount === undefined || !supervisorId || !locationId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check location exists
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // check supervisor exists
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    // create transaction
    const transaction = await Transaction.create({
      type,
      amount,
      description,
      supervisorId,
      locationId,
      status
    });

    // notification
    await createNotification(
      "New transaction added",
      `New ${type} entry of ₹${amount} added at ${location.name}`,
      "transaction"
    );

    return res.status(201).json({
      message: "Transaction created successfully",
      data: transaction
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

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

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
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
    transaction.amount = amount || transaction.amount;
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
