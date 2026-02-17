import { Request, Response } from "express";
import { Transaction } from "../models/transaction.model";

export const searchTransactions = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const searchKeyword = keyword.toString().trim();

    const transactions = await Transaction.find({
      $or: [
        { description: { $regex: searchKeyword, $options: "i" } },
        { type: { $regex: searchKeyword, $options: "i" } },
        { status: { $regex: searchKeyword, $options: "i" } }
      ]
    })
      .populate("supervisorId", "supervisorId name mobile email")
      .populate("locationId", "name address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Search results fetched successfully",
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
