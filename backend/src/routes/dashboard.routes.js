import express from "express";
import authenticateUser from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", authenticateUser, getDashboard);

export default router;
