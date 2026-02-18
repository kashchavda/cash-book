import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middlewares/auth.middleware";

// ================= GET PROFILE =================
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "Profile fetched successfully",
      data: user
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= UPDATE PROFILE =================
export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.phone = phone || user.phone;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      data: user
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= UPLOAD PROFILE PHOTO =================
export const uploadProfilePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Photo is required" });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const photoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    user.profilePhoto = photoUrl;
    await user.save();

    return res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhoto: user.profilePhoto
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password required" });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= REQUEST CHANGE EMAIL (SEND OTP) =================
export const requestChangeEmail = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: "New email is required" });
    }

    const existingEmail = await User.findOne({ email: newEmail });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailChangeOtp = otp;
    user.emailChangeOtpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 min
    user.pendingNewEmail = newEmail;

    await user.save();

    // TODO: send otp on email using nodemailer
    console.log("EMAIL OTP:", otp);

    return res.status(200).json({
      message: "OTP sent successfully",
      otp: otp // remove this in production
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= VERIFY CHANGE EMAIL OTP =================
export const verifyChangeEmail = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.emailChangeOtp || !user.emailChangeOtpExpiry) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    if (user.emailChangeOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.emailChangeOtpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (!user.pendingNewEmail) {
      return res.status(400).json({ message: "New email not found" });
    }

    user.email = user.pendingNewEmail;
    user.pendingNewEmail = undefined;
    user.emailChangeOtp = undefined;
    user.emailChangeOtpExpiry = undefined;

    await user.save();

    return res.status(200).json({
      message: "Email changed successfully",
      email: user.email
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= UPDATE NOTIFICATION SETTINGS =================
export const updateNotificationSettings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.notificationSettings = {
      ...user.notificationSettings,
      ...req.body
    };

    await user.save();

    return res.status(200).json({
      message: "Notification settings updated successfully",
      data: user.notificationSettings
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  GET NOTIFICATION SETTINGS 
export const getNotificationSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("notificationSettings");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "Notification settings fetched successfully",
      data: user.notificationSettings
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
