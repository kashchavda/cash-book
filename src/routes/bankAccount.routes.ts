import express from "express";
import {
  createBankAccount,
  getBankAccounts,
  getSingleBankAccount,
  updateBankAccount,
  deleteBankAccount
} from "../controllers/bankAccount.controller";

import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", protect, createBankAccount);
router.get("/", protect, getBankAccounts);
router.get("/:id", protect, getSingleBankAccount);
router.put("/:id", protect, updateBankAccount);
router.delete("/:id", protect, deleteBankAccount);

export default router;