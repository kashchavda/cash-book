import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionsByLocation,
  deleteTransaction,
  updateTransaction,
  uploadTransactionAttachment,
  getTransactionAttachment,
  downloadTransactionAttachment
} from "../controllers/transaction.controller";

import { upload } from "../middlewares/upload";

import { searchTransactions } from "../controllers/searchview.controller";

import {
  addItemToTransaction,
  updateItemInTransaction,
  deleteItemFromTransaction,
  getTransactionItems
} from "../controllers/transactionItem.controller";

const router = express.Router();

router.post("/create", createTransaction);
router.get("/all", getAllTransactions);
router.get("/search", searchTransactions);
router.get("/location/:locationId", getTransactionsByLocation);
router.put("/update/:id", updateTransaction);
router.delete("/delete/:id", deleteTransaction);

router.post(
  "/attachment/:id",
  upload.single("attachment"),
  uploadTransactionAttachment
);

router.get("/attachment/:id", getTransactionAttachment);

router.get("/attachment/download/:id", downloadTransactionAttachment);

router.post("/:transactionId/items", addItemToTransaction);
router.get("/:transactionId/items", getTransactionItems);
router.put("/:transactionId/items/:itemId", updateItemInTransaction);
router.delete("/:transactionId/items/:itemId", deleteItemFromTransaction);

export default router;
