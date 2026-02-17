import { Notification } from "../models/notification.model";

export const createNotification = async (
  title: string,
  message: string,
  type: string
) => {
  try {
    await Notification.create({
      title,
      message,
      type
    });
  } catch (error) {
    console.log("Notification error:", error);
  }
};
