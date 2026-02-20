import { Request, Response } from "express";
import mongoose from "mongoose";
import { Salary } from "../models/salary.model";
import { User } from "../models/user.model";

export const addSalary = async (req: Request, res: Response) => {
  try {
    const { supervisorId, amount, month, year, paidDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
      return res.status(400).json({ message: "Invalid supervisor ID" });
    }

    const supervisor = await User.findOne({
      _id: supervisorId,
      role: "supervisor",
    });

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    if (!amount || !month || !year) {
      return res.status(400).json({
        message: "Amount, month and year are required",
      });
    }

    const salary = await Salary.create({
      supervisor: supervisorId,
      amount,
      month,
      year,
      paidDate: paidDate ? new Date(paidDate) : new Date(),
    });

    return res.status(201).json({
      message: "Salary added successfully",
      data: salary,
    });

  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Salary already added for this month",
      });
    }

    return res.status(500).json({ message: error.message });
  }
};

export const getSalaryHistory = async (
  req: Request<{ supervisorId: string }>,
  res: Response
) => {
  try {
    const { supervisorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
      return res.status(400).json({ message: "Invalid supervisor ID" });
    }

    const salaries = await Salary.find({
      supervisor: supervisorId,
    })
      .sort({ year: -1, month: -1 });

    const totalAmount = salaries.reduce((sum, s) => sum + s.amount, 0);

    return res.status(200).json({
      totalRecords: salaries.length,
      totalAmount,
      data: salaries,
    });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// DOWNLOAD SALARY HISTORY (DATE FILTER BASED)
export const downloadSalaryHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const { supervisorId, type, startDate, endDate } = req.query;

    if (!supervisorId || !mongoose.Types.ObjectId.isValid(supervisorId as string)) {
      return res.status(400).json({ message: "Invalid supervisor ID" });
    }

    let filter: any = { supervisor: supervisorId };

    const today = new Date();
    let from: Date;
    let to: Date = new Date();

    if (type === "today") {
      from = new Date();
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      filter.paidDate = { $gte: from, $lte: to };
    }

    if (type === "last7days") {
      from = new Date();
      from.setDate(today.getDate() - 7);

      filter.paidDate = { $gte: from, $lte: to };
    }

    if (type === "thisMonth") {
      from = new Date(today.getFullYear(), today.getMonth(), 1);

      filter.paidDate = { $gte: from, $lte: to };
    }

    if (type === "custom") {
      if (!startDate || !endDate) {
        return res.status(400).json({
          message: "Start date and end date are required",
        });
      }

      filter.paidDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const salaries = await Salary.find(filter)
      .sort({ paidDate: -1 });

    const totalAmount = salaries.reduce((sum, s) => sum + s.amount, 0);

    return res.status(200).json({
      totalRecords: salaries.length,
      totalAmount,
      data: salaries,
    });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSingleSalary = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid salary ID" });
    }

    const salary = await Salary.findById(id);

    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    return res.status(200).json({ data: salary });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateSalary = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid salary ID" });
    }

    const updatedSalary = await Salary.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSalary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    return res.status(200).json({
      message: "Salary updated successfully",
      data: updatedSalary,
    });

  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Salary already exists for this month",
      });
    }

    return res.status(500).json({ message: error.message });
  }
};

export const deleteSalary = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid salary ID" });
    }

    const deleted = await Salary.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Salary not found" });
    }

    return res.status(200).json({
      message: "Salary deleted successfully",
    });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};