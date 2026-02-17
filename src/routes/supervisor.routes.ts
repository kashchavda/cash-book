import express from "express";
import {
  createSupervisor,
  getAllSupervisors,
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor
} from "../controllers/supervisor.controller";

const router = express.Router();

router.post("/create", createSupervisor);
router.get("/all", getAllSupervisors);
router.get("/:id", getSupervisorById);
router.put("/update/:id", updateSupervisor);
router.delete("/delete/:id", deleteSupervisor);

export default router;
