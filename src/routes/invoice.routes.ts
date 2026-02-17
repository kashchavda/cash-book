import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoicesByLocation,
  deleteInvoice
} from "../controllers/invoice.controller";

const router = express.Router();

router.post("/create", createInvoice);
router.get("/all", getAllInvoices);
router.get("/location/:locationId", getInvoicesByLocation);
router.delete("/delete/:id", deleteInvoice);

export default router;
