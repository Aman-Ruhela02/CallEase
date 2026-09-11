import { clerkMiddleware } from "@clerk/express";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import "./config/env.js";
import env from "./config/env.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import csvRoutes from "./routes/csv.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import excelRoutes from "./routes/excel.routes.js";
import imageRoutes from "./routes/image.routes.js";
import routes from "./routes/index.js";
import leadsRoutes from "./routes/leads.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();
// Trust Render's proxy so req.ip reflects the real client IP (needed for rate limiting)
app.set("trust proxy", 1);
//Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(env.NODE_ENV === "production" ? morgan("combined") : morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware()); //Clerk

app.use("/api", apiLimiter);
//Routes
app.use("/api", routes);
app.use("/api/profile", profileRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/upload", csvRoutes);
app.use("/api/upload", imageRoutes);
app.use("/api/upload", excelRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(notFound); // 404 not found middleware
app.use(errorHandler); //Global Error Handler

export default app;
