import { Request, Response } from "express";
import { User } from "../models/user.model";

// GET PROFILE
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      data: user
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { name, phone } = req.body;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      data: user
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// UPLOAD PROFILE PHOTO
export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Photo file is required" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    user.profilePhoto = fileUrl;

    await user.save();

    return res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhoto: user.profilePhoto
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// UPDATE NOTIFICATION SETTINGS
export const updateNotificationSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      enableAllNotifications,
      enableSalesAlerts,
      fundTransactionAlerts,
      newBillEntries,
      attendanceUpdates
    } = req.body;

    user.notificationSettings = {
      enableAllNotifications:
        enableAllNotifications ??
        user.notificationSettings.enableAllNotifications,

      enableSalesAlerts:
        enableSalesAlerts ?? user.notificationSettings.enableSalesAlerts,

      fundTransactionAlerts:
        fundTransactionAlerts ?? user.notificationSettings.fundTransactionAlerts,

      newBillEntries:
        newBillEntries ?? user.notificationSettings.newBillEntries,

      attendanceUpdates:
        attendanceUpdates ?? user.notificationSettings.attendanceUpdates
    };

    await user.save();

    return res.status(200).json({
      message: "Notification settings updated successfully",
      data: user.notificationSettings
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
