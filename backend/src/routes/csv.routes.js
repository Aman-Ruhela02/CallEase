import express from "express"
import multer from "multer"
import csv from "csv-parser";
import { uploadCSV } from "../controllers/csv.controller.js"
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router()


const upload = multer({
    storage: multer.memoryStorage()
})

router.post("/csv",authenticateUser,upload.single("file"),uploadCSV)

export default router 


