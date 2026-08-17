import { errorResponse } from "../utils/apiResponse.js"

export default function errorHandler (err, req, res, next){
    console.error(err)
    
    const statusCode = err.statusCode || 500

    return errorResponse(
        res,
        err.message || "Internal Server error",
        statusCode
    )
}