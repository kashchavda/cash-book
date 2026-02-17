import express from "express";
import {
  dashboardSummary,
  supervisorBalances,
  recentTransactions,
  recentInvoices,
  locationsList,
  homeDashboard
} from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/summary", dashboardSummary);
router.get("/supervisors", supervisorBalances);
router.get("/transactions", recentTransactions);
router.get("/invoices", recentInvoices);
router.get("/locations", locationsList);

router.get("/home", homeDashboard);

export default router;
