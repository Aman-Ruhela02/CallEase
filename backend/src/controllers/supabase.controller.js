import supabase from "../lib/supabase.js"
import { successResponse } from "../utils/apiResponse.js"


export const testSupabase = async (req,res)=>{
     try {
        const {data,error} = await supabase.from("test_connection")
        .select("*")

        if(error){
            throw error
        }

        successResponse(
            res,
            data,
            "Supabase connection successfully"
        )
     } catch (error) {
        next(error)
     }
}