import {
  createUserProfile,
  getUserProfile,
} from "../services/profile.service.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const createProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return errorResponse(res, "Name and email are required", 400);
    }
    const profile = await createUserProfile({
      clerkUserId: req.userId,
      name,
      email,
    });
    return successResponse(res, profile, "Profile created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await getUserProfile(req.userId);
    return successResponse(res, profile, "Profile fetched successfully");
  } catch (error) {
    next(error);
  }
};
