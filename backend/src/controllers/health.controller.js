import { successResponse } from "../utils/apiResponse.js";
import getHealthData from "../services/health.service.js";

export const getHealth = (req, res) => {
  const data = getHealthData();
  successResponse(res, data, "Backend is running...");
};
