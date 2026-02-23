import express from "express";
import {
  markWorkerAttendance,
  getWorkerAttendanceByDate,
  getWorkerHistory,
  searchWorker,
  deleteWorkerAttendance,
} from "../controllers/workerAttendance.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", protect, markWorkerAttendance);
router.get("/date", protect, getWorkerAttendanceByDate);
router.get("/history/:workerId", protect, getWorkerHistory);
router.get("/search", protect, searchWorker);
router.delete("/", protect, deleteWorkerAttendance);

export default router;