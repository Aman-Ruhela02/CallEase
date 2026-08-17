import { getAuth } from "@clerk/express";

const authenticateUser = (req,res,next)=>{
    const auth = getAuth(req)

    if(!auth.isAuthenticated || !auth.userId){
        return res.status(401).json({
            success:false ,
            message: "User is not authenticated"
        })
    }

    req.userId = auth.userId 

    next()
}

export default authenticateUser