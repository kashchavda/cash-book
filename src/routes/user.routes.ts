import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload";

import {
  getMyProfile,
  updateMyProfile,
  uploadProfilePhoto,
  changePassword,
  requestChangeEmail,
  verifyChangeEmail,
  updateNotificationSettings,
  getNotificationSettings
} from "../controllers/user.controller";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

router.post("/me/photo", protect, upload.single("photo"), uploadProfilePhoto);

router.put("/me/change-password", protect, changePassword);

router.post("/me/change-email/request", protect, requestChangeEmail);
router.post("/me/change-email/verify", protect, verifyChangeEmail);

router.get("/me/notification-settings", protect, getNotificationSettings);
router.put("/me/notification-settings", protect, updateNotificationSettings);

export default router;
