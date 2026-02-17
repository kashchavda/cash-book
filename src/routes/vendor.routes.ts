import express from "express";
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor
} from "../controllers/vendor.controller";

const router = express.Router();

router.post("/create", createVendor);
router.get("/all", getAllVendors);
router.get("/:id", getVendorById);
router.put("/update/:id", updateVendor);
router.delete("/delete/:id", deleteVendor);

export default router;
