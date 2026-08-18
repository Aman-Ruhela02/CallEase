import { getUserDashboard } from "../services/leads.service.js";

export const getDashboard = async (req, res, next) => {
  try {
   

    const dashboardData = await getUserDashboard(req.userId);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};