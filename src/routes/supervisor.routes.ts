import express from "express";
import {
  createSupervisor,
  getAllSupervisors,
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor,
} from "../controllers/supervisor.controller";

const router = express.Router();

router.post("/", createSupervisor);
router.get("/", getAllSupervisors);
router.get("/:id", getSupervisorById);
router.put("/:id", updateSupervisor);
router.delete("/:id", deleteSupervisor);

export default router;