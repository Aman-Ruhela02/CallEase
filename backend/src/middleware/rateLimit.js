import { getAuth } from "@clerk/express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getAuth(req)?.userId || ipKeyGenerator(req.ip),
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getAuth(req)?.userId || ipKeyGenerator(req.ip),
  message: {
    success: false,
    message: "Too many upload requests, please slow down",
  },
});
