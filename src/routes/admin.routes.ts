import express from "express";
import { createAdmin } from "../controllers/admin.controller";

const router = express.Router();

router.post("/create", createAdmin);

export default router;
