import express from "express";
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  toggleVendorStatus
} from "../controllers/vendor.controller";

const router = express.Router();

router.post("/", createVendor);
router.get("/", getAllVendors);
router.get("/:id", getVendorById);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);
router.patch("/status/:id", toggleVendorStatus);

export default router;