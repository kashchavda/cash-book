import express from "express";
import { upload } from "../middlewares/upload";

import {
  uploadTransactionAttachment,
  getTransactionAttachment,
  downloadTransactionAttachment,
  deleteTransaction
} from "../controllers/funds.controller";

const router = express.Router();

router.post("/upload/:id", upload.single("attachment"), uploadTransactionAttachment);

router.get("/attachment/:id", getTransactionAttachment);

router.get("/download/:id", downloadTransactionAttachment);

router.delete("/delete/:id", deleteTransaction);

export default router;


