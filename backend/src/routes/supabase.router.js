import express from "express";
import { testSupabase } from "../controllers/supabase.controller.js";

const router = express.Router();

router.get("/test", testSupabase);

export default router;
