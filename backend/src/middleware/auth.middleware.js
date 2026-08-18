import { getAuth } from "@clerk/express";

const authenticateUser = (req,res,next)=>{
    const { isAuthenticated, userId } = getAuth(req);
    

    if(!isAuthenticated || !userId){
        return res.status(401).json({
            success:false ,
            message: "User is not authenticated"
        })
    }

    req.userId = userId 

    next()
}

export default authenticateUser