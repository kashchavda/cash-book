import { Request, Response } from "express";
import { Transaction } from "../models/transaction.model";
import { Supervisor } from "../models/supervisor.model";
import { Invoice } from "../models/invoice.model";
import { Location } from "../models/location.model";

const getDateFilter = (req: Request) => {
  const { from, to } = req.query;

  let filter: any = {};

  if (from && to) {
    filter = {
      createdAt: {
        $gte: new Date(from as string),
        $lte: new Date(to as string)
      }
    };
  }

  return filter;
};

export const dashboardSummary = async (req: Request, res: Response) => {
  try {
    const dateFilter = getDateFilter(req);

    const credits = await Transaction.aggregate([
      { $match: { ...dateFilter, type: "credit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const debits = await Transaction.aggregate([
      { $match: { ...dateFilter, type: "debit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const transfers = await Transaction.aggregate([
      { $match: { ...dateFilter, type: "internal_transfer" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const creditTotal = credits.length > 0 ? credits[0].total : 0;
    const debitTotal = debits.length > 0 ? debits[0].total : 0;
    const transferTotal = transfers.length > 0 ? transfers[0].total : 0;

    const balance = creditTotal - debitTotal;

    return res.status(200).json({
      message: "Dashboard summary fetched successfully",
      data: {
        balance,
        credits: creditTotal,
        debits: debitTotal,
        internalTransfer: transferTotal
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const supervisorBalances = async (req: Request, res: Response) => {
  try {
    const dateFilter = getDateFilter(req);

    const supervisors = await Supervisor.find();

    const result = [];

    for (const sup of supervisors) {
      const credit = await Transaction.aggregate([
        { $match: { ...dateFilter, supervisorId: sup._id, type: "credit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      const debit = await Transaction.aggregate([
        { $match: { ...dateFilter, supervisorId: sup._id, type: "debit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      const creditTotal = credit.length > 0 ? credit[0].total : 0;
      const debitTotal = debit.length > 0 ? debit[0].total : 0;

      result.push({
        id: sup._id,
        supervisorId: sup.supervisorId,
        name: sup.name,
        credit: creditTotal,
        debit: debitTotal,
        balance: creditTotal - debitTotal
      });
    }

    return res.status(200).json({
      message: "Supervisor balances fetched successfully",
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const recentTransactions = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const dateFilter = getDateFilter(req);

    const transactions = await Transaction.find(dateFilter)
      .populate("supervisorId", "name supervisorId")
      .populate("locationId", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      message: "Recent transactions fetched successfully",
      data: transactions
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const recentInvoices = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const invoices = await Invoice.find()
      .populate("locationId", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      message: "Recent invoices fetched successfully",
      data: invoices
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const locationsList = async (req: Request, res: Response) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Locations fetched successfully",
      data: locations
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const homeDashboard = async (req: Request, res: Response) => {
  try {
    const dateFilter = getDateFilter(req);

    const creditTotal = await Transaction.aggregate([
      { $match: { ...dateFilter, type: "credit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const debitTotal = await Transaction.aggregate([
      { $match: { ...dateFilter, type: "debit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const transferTotal = await Transaction.aggregate([
      { $match: { ...dateFilter, type: "internal_transfer" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const credits = creditTotal.length ? creditTotal[0].total : 0;
    const debits = debitTotal.length ? debitTotal[0].total : 0;
    const internalTransfer = transferTotal.length ? transferTotal[0].total : 0;

    const balance = credits - debits;

    const supervisors = await Supervisor.find();

    const supervisorData = [];
    for (const sup of supervisors) {
      const credit = await Transaction.aggregate([
        { $match: { ...dateFilter, supervisorId: sup._id, type: "credit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      const debit = await Transaction.aggregate([
        { $match: { ...dateFilter, supervisorId: sup._id, type: "debit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      const c = credit.length ? credit[0].total : 0;
      const d = debit.length ? debit[0].total : 0;

      supervisorData.push({
        id: sup._id,
        supervisorId: sup.supervisorId,
        name: sup.name,
        credit: c,
        debit: d,
        balance: c - d
      });
    }

    const invoices = await Invoice.find()
      .populate("locationId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const transactions = await Transaction.find(dateFilter)
      .populate("supervisorId", "name supervisorId")
      .populate("locationId", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    const locations = await Location.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Home dashboard data fetched successfully",
      data: {
        summary: {
          balance,
          credits,
          debits,
          internalTransfer
        },
        supervisors: supervisorData,
        invoices,
        transactions,
        locations
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
