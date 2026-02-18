import express from "express";
import {
  createBill,
  getAllBills,
  getBillDetails,
  uploadBillAttachment,
  viewBillAttachment,
  downloadBillAttachment
} from "../controllers/bill.controller";

import { upload } from "../middlewares/upload";


const router = express.Router();

router.post("/create", createBill);
router.get("/all", getAllBills);
router.get("/details/:billId", getBillDetails);
router.post("/attachment/upload/:billId", upload.single("file"), uploadBillAttachment);
router.get("/attachment/view/:billId", viewBillAttachment);
router.get("/attachment/download/:billId", downloadBillAttachment);

export default router;
