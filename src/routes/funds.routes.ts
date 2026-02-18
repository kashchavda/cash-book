import express from "express";
import {
  createFund,
  getAllFunds,
  getFundById,
  updateFund,
  deleteFund,
  uploadFundAttachment,
  downloadFundAttachment
} from "../controllers/funds.controller";

import { upload } from "../middlewares/upload";

const router = express.Router();

router.post("/create", createFund);
router.get("/all", getAllFunds);
router.get("/:id", getFundById);
router.put("/update/:id", updateFund);
router.delete("/delete/:id", deleteFund);

router.post(
  "/attachment/:id",
  upload.single("attachment"),
  uploadFundAttachment
);

router.get("/attachment/download/:id", downloadFundAttachment);

export default router;
