import express from "express";
import {
  setPermissions,
  getPermissions,
} from "../controllers/permission.controller";

const router = express.Router();

router.post("/", setPermissions);
router.get("/:supervisorId", getPermissions);

export default router;