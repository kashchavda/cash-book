import express from "express";
import {
  createSubAdmin,
  getAllSubAdmins,
  getSubAdminById,
  updateSubAdmin,
  deleteSubAdmin,
  toggleStatus
} from "../controllers/subadmin.controller";

const router = express.Router();

router.post("/", createSubAdmin);
router.get("/", getAllSubAdmins);
router.get("/:id", getSubAdminById);
router.put("/:id", updateSubAdmin);
router.delete("/:id", deleteSubAdmin);
router.patch("/status/:id", toggleStatus);

export default router;