import errorHandler from './middleware/errorHandler.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'

import { clerkMiddleware } from "@clerk/express";

import { successResponse } from './utils/apiResponse.js'
import AppError from './utils/AppError.js'
import notFound from './middleware/notFound.js'
import routes from './routes/index.js'
import profileRoutes from "./routes/profile.routes.js";
import leadsRoutes from './routes/leads.routes.js'
import csvRoutes  from './routes/csv.routes.js'
import imageRoutes from './routes/image.routes.js'
import excelRoutes from './routes/excel.routes.js'
import dashboardRoutes from "./routes/dashboard.routes.js";
import './config/env.js'


const app = express()

//Middleware
app.use(cors())
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Clerk
app.use(clerkMiddleware());

//Routes
app.use('/api',routes)
app.use('/api/profile',profileRoutes)
app.use('/api/leads',leadsRoutes)
app.use('/api/upload',csvRoutes )
app.use('/api/upload',imageRoutes)
app.use("/api/upload", excelRoutes);
app.use("/api/dashboard", dashboardRoutes);


// 404 not found middleware
app.use(notFound)

//Global Error Handler
app.use(errorHandler)


export default app 