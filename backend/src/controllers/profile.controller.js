import { getAuth } from "@clerk/express";
import { createUserProfile, getUserProfile } from "../services/profile.service.js";

export const createProfile = async (req, res, next) => {
  try {

    const { isAuthenticated, userId } = getAuth(req);

    //Check clerk authentication
    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const {name,email} = req.body 
    if(!name || !email){
      return res.status(400).json({
        success: false,
        message: "Name and email are required"
      })
    }

    const profile = await createUserProfile({
      clerkUserId: userId,
      name,
      email  
    })

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile
    })
    
  } catch (error) {
    next(error);
  }
}


export const getProfile = async (req,res,next) =>{
  try {
     const { isAuthenticated, userId } = getAuth(req);

      // Check Clerk authentication
    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const profile = await getUserProfile(userId)

    return res.status(200).json({
      success: true,
      message:  "Profile fetched successfully",
      data: profile 
    })
  } catch (error) {
    next(error)
  }
}