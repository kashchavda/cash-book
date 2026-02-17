import express from "express";
import {
  createWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker
} from "../controllers/worker.controller";

const router = express.Router();

router.post("/create", createWorker);
router.get("/all", getAllWorkers);
router.get("/:id", getWorkerById);
router.put("/update/:id", updateWorker);
router.delete("/delete/:id", deleteWorker);

export default router;
