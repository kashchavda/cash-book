import express from "express";
import { body } from "express-validator";

import {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  addBusinessLocation,
  updateBusinessLocation,
  deleteBusinessLocation,
  uploadBusinessPhoto
} from "../controllers/business.controller";

import { validateRequest } from "../middlewares/validation.middleware";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload";

const router = express.Router();

// CREATE BUSINESS
router.post(
  "/",
  protect,
  [
    body("businessName").notEmpty().withMessage("Business name is required"),
    body("businessCategory").notEmpty().withMessage("Business category is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("gstn").notEmpty().withMessage("GSTN is required")
  ],
  validateRequest,
  createBusiness
);

router.get("/", protect, getAllBusinesses);
router.get("/:businessId", protect, getBusinessById);
router.put("/:businessId", protect, updateBusiness);
router.delete("/:businessId", protect, deleteBusiness);

router.post(
  "/:businessId/location",
  protect,
  [
    body("locationName").notEmpty().withMessage("Location name is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("pincode").notEmpty().withMessage("Pincode is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("state").notEmpty().withMessage("State is required")
  ],
  validateRequest,
  addBusinessLocation
);

router.put("/:businessId/location/:locationId", protect, updateBusinessLocation);
router.delete("/:businessId/location/:locationId", protect, deleteBusinessLocation);

router.put(
  "/:businessId/photo",
  protect,
  upload.single("businessPhoto"),
  uploadBusinessPhoto
);

export default router;
