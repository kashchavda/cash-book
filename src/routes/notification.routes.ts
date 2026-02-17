import express from "express";
import { getAllNotifications, markAsRead } from "../controllers/notification.controller";

const router = express.Router();

router.get("/all", getAllNotifications);
router.put("/read/:id", markAsRead);

export default router;
