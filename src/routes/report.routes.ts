import express from "express";
import {
  getExpenseReport,
  getFundTransferReport,
  getSalaryReport,
  getAttendanceReport,
  getInvoiceReport,
  getSiteWiseReport
} from "../controllers/report.controller";

import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/expense", protect, getExpenseReport);
router.get("/fund-transfer", protect, getFundTransferReport);
router.get("/salary", protect, getSalaryReport);
router.get("/attendance", protect, getAttendanceReport);
router.get("/invoice", protect, getInvoiceReport);
router.get("/site-wise", protect, getSiteWiseReport);

export default router;