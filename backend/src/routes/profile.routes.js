import express from 'express'
import { createProfile, getProfile , } from "../controllers/profile.controller.js";
import authenticateUser from '../middleware/auth.middleware.js';

const router = express.Router()
 

router.post("/",authenticateUser,createProfile)
router.get("/",authenticateUser,getProfile)

export default router;