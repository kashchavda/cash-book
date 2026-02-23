import express from "express";
import {
  markAttendance,
  getAttendanceByDate,
  getAttendanceHistory,
  searchSupervisor,
  deleteAttendance,
} from "../controllers/attendance.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Mark / Update
router.post("/", protect, markAttendance);
router.get("/date", protect, getAttendanceByDate);
router.get("/history/:supervisorId", protect, getAttendanceHistory);
router.get("/search", protect, searchSupervisor);
router.delete("/", protect, deleteAttendance);

export default router;