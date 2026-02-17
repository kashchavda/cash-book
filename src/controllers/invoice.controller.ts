import { Request, Response } from "express";
import { Invoice } from "../models/invoice.model";
import { Location } from "../models/location.model";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { title, amount, invoiceDate, locationId } = req.body;

    if (!title || !amount || !locationId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const invoice = await Invoice.create({
      title,
      amount,
      invoiceDate,
      locationId
    });

    return res.status(201).json({
      message: "Invoice created successfully",
      data: invoice
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find()
      .populate("locationId", "name address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Invoices fetched successfully",
      total: invoices.length,
      data: invoices
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getInvoicesByLocation = async (req: Request, res: Response) => {
  try {
    const { locationId } = req.params;

    const invoices = await Invoice.find({ locationId })
      .populate("locationId", "name address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Location invoices fetched successfully",
      total: invoices.length,
      data: invoices
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json({
      message: "Invoice deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
