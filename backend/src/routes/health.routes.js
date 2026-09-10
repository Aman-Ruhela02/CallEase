import express from "express";
import { successResponse } from "../utils/apiResponse.js";

const router = express.Router();

router.get("/", (req, res) => {
    successResponse(res, { server: "Call Ease Backend", version: "1.0.0", status: "healthy" }, "Backend is running healthy");
});

export default router;
