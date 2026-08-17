import { getUserDashboard } from "../services/leads.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const clerkUserId = req.userId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const dashboardData = await getUserDashboard(clerkUserId);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};