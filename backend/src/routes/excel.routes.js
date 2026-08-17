import express from "express";
import multer from "multer";
import { uploadExcel } from "../controllers/excel.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/excel",authenticateUser,upload.single("file"),uploadExcel);

export default router;  