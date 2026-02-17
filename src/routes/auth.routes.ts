import express from "express";
import { body } from "express-validator";

import {
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword
} from "../controllers/auth.controller";

import { validateRequest } from "../middlewares/validation.middleware";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  loginUser
);

router.post(
  "/forgot-password",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Enter a valid email address")
  ],
  validateRequest,
  forgotPassword
);

router.post(
  "/verify-otp",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("otp").notEmpty().withMessage("OTP is required"),
    body("otp").isLength({ min: 4, max: 6 }).withMessage("OTP must be valid")
  ],
  validateRequest,
  verifyOTP
);

router.post(
  "/reset-password",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Enter a valid email address"),

    body("newPassword").notEmpty().withMessage("New password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),

    body("confirmPassword").notEmpty().withMessage("Confirm password is required")
  ],
  validateRequest,
  resetPassword
);

export default router;
