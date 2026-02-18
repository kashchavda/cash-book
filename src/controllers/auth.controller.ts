import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { generateOTP } from "../services/otp.service";
import { generateToken } from "../utils/generateToken";
import { sendEmailOTP } from "../services/mail.service";

// =======================
// REGISTER / CREATE USER
// =======================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ message: "User with this email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      role: role || "user",
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =======================
// LOGIN USER
// =======================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =======================
// FORGOT PASSWORD
// =======================
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.otpVerified = false;

    await user.save();

    // SEND OTP TO EMAIL
    await sendEmailOTP(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully to your email"
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =======================
// VERIFY OTP
// =======================
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpire && user.otpExpire < new Date())
      return res.status(400).json({ message: "OTP expired" });

    user.otpVerified = true;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =======================
// RESET PASSWORD
// =======================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otpVerified)
      return res.status(400).json({ message: "OTP not verified" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpire = null;
    user.otpVerified = false;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
