import express from "express";
import { downloadVendorBillingHistory } from "../controllers/vendorBill.controller";

const router = express.Router();

router.post("/download", downloadVendorBillingHistory);

export default router;