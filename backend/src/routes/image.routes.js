import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/image.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/image", authenticateUser, upload.single("file"), uploadImage);

export default router;
