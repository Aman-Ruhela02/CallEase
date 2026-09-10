import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/image.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";
import { uploadLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if(!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, or WEBP images are allowed"));
    }
    cb(null, true);
  }
});

router.post("/image", uploadLimiter, authenticateUser, upload.single("file"), uploadImage);

export default router;
