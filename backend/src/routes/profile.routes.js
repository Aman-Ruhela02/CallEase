import express from 'express'
import { createProfile, getProfile , } from "../controllers/profile.controller.js";


const router = express.Router();
 

router.post("/",createProfile);
router.get('/',getProfile)

export default router;