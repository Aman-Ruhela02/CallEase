
import { createUserProfile, getUserProfile } from "../services/profile.service.js";

export const createProfile = async (req, res, next) => {
  try {


    const {name,email} = req.body 
    if(!name || !email){
      return res.status(400).json({
        success: false,
        message: "Name and email are required"
      })
    }

    const profile = await createUserProfile({
      clerkUserId: req.userId,
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
    
    const profile = await getUserProfile(req.userId)

    return res.status(200).json({
      success: true,
      message:  "Profile fetched successfully",
      data: profile 
    })
  } catch (error) {
    next(error)
  }
}