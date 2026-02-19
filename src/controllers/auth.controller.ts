import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { generateOTP } from "../services/otp.service";
import { generateToken } from "../utils/generateToken";
import { sendEmailOTP } from "../services/mail.service";
import { TokenBlacklist } from "../models/tokenBlacklist.model";

// REGISTER / CREATE USER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ message: "User with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

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

// LOGIN USER
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

// LOGOUT USER
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const expireAt = new Date(decoded.exp * 1000);

    await TokenBlacklist.create({ token, expireAt });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// FORGOT PASSWORD
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

    await sendEmailOTP(email, otp);

    return res.status(200).json({ message: "OTP sent successfully to your email" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// VERIFY OTP
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

// RESET PASSWORD
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

// REQUEST EMAIL CHANGE
export const requestEmailChange = async (req: Request, res: Response) => {
  try {
    const { userId, newEmail } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = await User.findOne({ email: newEmail.toLowerCase() });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const otp = generateOTP();
    user.emailChangeOtp = otp;
    user.emailChangeOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.pendingNewEmail = newEmail.toLowerCase();

    await user.save();
    await sendEmailOTP(newEmail, otp);

    return res.status(200).json({ message: "OTP sent to new email" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// VERIFY EMAIL CHANGE
export const verifyEmailChange = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.emailChangeOtp || user.emailChangeOtp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.emailChangeOtpExpiry && user.emailChangeOtpExpiry < new Date())
      return res.status(400).json({ message: "OTP expired" });

    if (user.pendingNewEmail) {
      user.email = user.pendingNewEmail;
      user.pendingNewEmail = null;
      user.emailChangeOtp = null;
      user.emailChangeOtpExpiry = null;
      await user.save();
    }

    return res.status(200).json({ message: "Email updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
