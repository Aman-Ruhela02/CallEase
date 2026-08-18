import express from "express"
import { createLead, getLeads ,deleteLead } from "../controllers/leads.controller.js"
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router()

router.post('/', authenticateUser, createLead)
router.get('/',authenticateUser, getLeads)
router.delete("/:id", authenticateUser, deleteLead);


export default router 


