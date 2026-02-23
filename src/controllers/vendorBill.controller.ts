import { Request, Response } from "express";
import { VendorBill } from "../models/VendorBill.model";

export const downloadVendorBillingHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const { filterType, startDate, endDate } = req.body;

    let dateFilter: any = {};

    const today = new Date();

    //TODAY
    if (filterType === "today") {
      const start = new Date(today.setHours(0, 0, 0, 0));
      const end = new Date(today.setHours(23, 59, 59, 999));

      dateFilter = { billDate: { $gte: start, $lte: end } };
    }

    //LAST 7 DAYS
    else if (filterType === "last7days") {
      const last7 = new Date();
      last7.setDate(today.getDate() - 7);

      dateFilter = { billDate: { $gte: last7, $lte: new Date() } };
    }

    //THIS MONTH
    else if (filterType === "thisMonth") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      dateFilter = { billDate: { $gte: firstDay, $lte: lastDay } };
    }

    //CUSTOM DATE RANGE
    else if (filterType === "custom") {
      if (!startDate || !endDate) {
        return res.status(400).json({
          message: "Start date and End date are required for custom filter",
        });
      }

      dateFilter = {
        billDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const bills = await VendorBill.find(dateFilter).populate("vendor");

    return res.status(200).json({
      success: true,
      total: bills.length,
      data: bills,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error downloading vendor billing history",
      error,
    });
  }
};