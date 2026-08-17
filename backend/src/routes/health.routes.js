import express from 'express'
import { successResponse } from '../utils/apiResponse.js'
import { getHealth } from '../controllers/health.controller.js'

const router = express.Router()

router.get('/',getHealth)

export default router 
