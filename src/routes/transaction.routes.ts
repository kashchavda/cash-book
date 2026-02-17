import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionsByLocation,
  deleteTransaction,
  updateTransaction
} from "../controllers/transaction.controller";

import { searchTransactions } from "../controllers/searchview.controller";

const router = express.Router();

router.post("/create", createTransaction);
router.get("/all", getAllTransactions);

router.get("/search", searchTransactions); 

router.get("/location/:locationId", getTransactionsByLocation);

router.put("/update/:id", updateTransaction);

router.delete("/delete/:id", deleteTransaction);

export default router;
