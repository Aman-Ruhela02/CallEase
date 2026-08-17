import express from 'express'
import healthRoutes from './health.routes.js'
import supabaseRoutes from './supabase.router.js'
import authRoutes from './auth.routes.js'

const router = express.Router()

router.use("/health",healthRoutes)
router.use('/supabase',supabaseRoutes)
router.use('/auth',authRoutes)


export default router 
