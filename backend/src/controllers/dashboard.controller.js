import { getUserDashboard } from "../services/leads.service.js";
import { successResponse } from "../utils/apiResponse.js";

export const getDashboard = async (req, res, next) => {
  try {
    const dashboardData = await getUserDashboard(req.userId)
    return successResponse(res, dashboardData, "Dashboard data fetched successfully");
  } catch (error) {
    next(error);
  }
};