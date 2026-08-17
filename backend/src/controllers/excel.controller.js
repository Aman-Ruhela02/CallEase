import { parseExcel } from "../services/excel.service.js";
import { saveUserLeads } from "../services/leads.service.js";

export const uploadExcel = async (req,res,next) =>{
    try {
        if(!req.file){
            return res.status(400).json({
                success:false,
                message: "Excel file is required"
            })
        }

       const clerkUserId = req.userId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

     const rows = parseExcel(req.file.buffer);

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "Excel file is empty",
      });
    }
  
    console.log("Excel rows:", rows);

    const leads = rows.map((row) => ({
      name: String(
        row.Name ||
        row.name ||
        ""
      ).trim(),

      phone: String(
        row.Phone ||
        row.phone ||
        row["Phone Number"] ||
        ""
      ).trim(),

      location: String(
        row.Location ||
        row.location ||
        row.City ||
        row.city ||
        ""
      ).trim(),
    }));


    const invalidLeads = leads.filter(
      (lead) => !lead.phone
    );

    if (invalidLeads.length) {
      return res.status(400).json({
        success: false,
        message: "Some leads are missing phone numbers",
        invalidCount: invalidLeads.length,
      });
    }

     const savedLeads = await saveUserLeads({
      clerkUserId,
      leads,
    });

     return res.status(201).json({
      success: true,
      message: "Excel uploaded and leads saved successfully",
      count: savedLeads.length,
      data: savedLeads,
    });

    } catch (error) {
        
    }
}