import { getAuth } from "@clerk/express";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const getCurrentUser = (req, res, next) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);
    if (!isAuthenticated) {
      return errorResponse(res, "User is not authenticated", 401);
    }
    return successResponse(res, { userId }, "Authenticated user");
  } catch (error) {
    next(error);
  }
};
