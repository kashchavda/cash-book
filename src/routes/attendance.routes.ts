import express from "express";
import { markAttendance, getAttendance } from "../controllers/attendance.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", protect, markAttendance);
router.get("/:supervisorId", protect, getAttendance);

export default router;