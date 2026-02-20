import express from "express";
import {
  addSalary,
  getSalaryHistory,
  getSingleSalary,
  updateSalary,
  deleteSalary,
  downloadSalaryHistory
} from "../controllers/salary.controller";

const router = express.Router();

router.post("/", addSalary);

// Download salary history (MUST be before /:id)
router.get("/download", downloadSalaryHistory);

router.get("/supervisor/:supervisorId", getSalaryHistory);
router.get("/:id", getSingleSalary);
router.put("/:id", updateSalary);
router.delete("/:id", deleteSalary);
export default router;