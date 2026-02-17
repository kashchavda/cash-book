import express from "express";
import {
  createSubAdmin,
  getAllSubAdmins,
  getSubAdminById,
  updateSubAdmin,
  deleteSubAdmin
} from "../controllers/subadmin.controller";

const router = express.Router();

router.post("/create", createSubAdmin);
router.get("/all", getAllSubAdmins);
router.get("/:id", getSubAdminById);
router.put("/update/:id", updateSubAdmin);
router.delete("/delete/:id", deleteSubAdmin);

export default router;
