import { Request, Response } from "express";
import { Expense } from "../models/expense.model";
import { FundTransfer } from "../models/fundTransfer.model";
import { Salary } from "../models/salary.model";
import { Attendance } from "../models/attendance.model";
import { Invoice } from "../models/invoice.model";
import { Site } from "../models/site.model";

// ===============================
// 1️⃣ EXPENSE REPORT
// ===============================
export const getExpenseReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, supervisor, location, paymentStatus } = req.query;

    let filter: any = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    if (supervisor) filter.supervisor = supervisor;
    if (location) filter.location = location;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const expenses = await Expense.find(filter)
      .populate("supervisor", "name")
      .populate("vendor", "name")
      .sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ===============================
// 2️⃣ FUND TRANSFER REPORT
// ===============================
export const getFundTransferReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, supervisor, location } = req.query;

    let filter: any = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    if (supervisor) filter.supervisor = supervisor;
    if (location) filter.location = location;

    const transfers = await FundTransfer.find(filter)
      .populate("supervisor", "name")
      .sort({ date: -1 });

    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ===============================
// 3️⃣ SALARY REPORT
// ===============================
export const getSalaryReport = async (req: Request, res: Response) => {
  try {
    const { month, year, supervisor } = req.query;

    let filter: any = {};

    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (supervisor) filter.supervisor = supervisor;

    const salaries = await Salary.find(filter)
      .populate("supervisor", "name email")
      .sort({ year: -1, month: -1 });

    const totalAmount = salaries.reduce((sum, s) => sum + s.amount, 0);

    res.status(200).json({
      totalRecords: salaries.length,
      totalAmount,
      data: salaries
    });

  } catch (error: any) {
    console.error("Salary Report Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// 4️⃣ ATTENDANCE REPORT
// ===============================
export const getAttendanceReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, employeeType, status } = req.query;

    let filter: any = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    if (employeeType) filter.employeeType = employeeType;
    if (status) filter.status = status;

    const attendance = await Attendance.find(filter)
      .populate("supervisor", "name email")
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ===============================
// 5️⃣ INVOICE REPORT
// ===============================
export const getInvoiceReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let filter: any = {};

    if (startDate && endDate) {
      filter.invoiceDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const invoices = await Invoice.find(filter)
      .populate("locationId", "name")  // ✅ correct field
      .sort({ invoiceDate: -1 });

    res.status(200).json(invoices);

  } catch (error: any) {
    console.error("Invoice Report Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// 6️⃣ SITE-WISE REPORT
// ===============================
export const getSiteWiseReport = async (req: Request, res: Response) => {
  try {
    const report = await Expense.aggregate([
      {
        $group: {
          _id: "$location",
          totalExpense: { $sum: "$amount" }
        }
      }
    ]);

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};