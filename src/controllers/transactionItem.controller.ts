import { Request, Response } from "express";
import { Transaction } from "../models/transaction.model";

export const addItemToTransaction = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId as string;

    const { itemName, locationId, entries } = req.body;

    if (!itemName || !locationId || !entries || entries.length === 0) {
      return res.status(400).json({
        message: "itemName, locationId and entries are required"
      });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.items.push({
      itemName,
      locationId,
      entries
    });

    await transaction.save();

    return res.status(201).json({
      message: "Item added successfully",
      data: transaction
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const updateItemInTransaction = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId as string;
    const itemId = req.params.itemId as string;

    const { itemName, locationId, entries } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const item = transaction.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (itemName) item.itemName = itemName;
    if (locationId) item.locationId = locationId;
    if (entries) item.entries = entries;

    await transaction.save();

    return res.status(200).json({
      message: "Item updated successfully",
      data: transaction
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteItemFromTransaction = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId as string;
    const itemId = req.params.itemId as string;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const item = transaction.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.deleteOne();
    await transaction.save();

    return res.status(200).json({
      message: "Item deleted successfully",
      data: transaction
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getTransactionItems = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId as string;

    const transaction = await Transaction.findById(transactionId).populate(
      "items.locationId",
      "name address"
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({
      message: "Items fetched successfully",
      total: transaction.items.length,
      data: transaction.items
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
