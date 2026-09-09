import { getAuth } from "@clerk/express";
import { successResponse } from "../utils/apiResponse.js";

export const getCurrentUser = (req, res, next) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    successResponse(
      res,
      {
        userId,
      },
      "Authenticated user",
    );
  } catch (error) {
    next(error);
  }
};
