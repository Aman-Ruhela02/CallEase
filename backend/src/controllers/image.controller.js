import { extractTextFromImage } from "../services/ocr.service.js";
import { parseImageLeads } from "../services/imageLeadParser.service.js";
import { saveUserLeads } from "../services/leads.service.js";

export const uploadImage = async(req,res,next)=>{
  
    try {
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            })
        }

        
            const clerkUserId = req.userId;
            if (!clerkUserId) {
                console.log('clerk id not found ');
                
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }
    

        console.log("Image received : ");
        console.log({
            name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
        });


        // 1. OCR                   
        const text = await extractTextFromImage(
      req.file.buffer
    );

    console.log("OCR TEXT:");
    console.log(text);

    if (!text.trim()) {
      return res.status(400).json({
        success: false,
        message: "No text detected in image",
      });
    }

    // 2. Parse OCR text
    const leads = parseImageLeads(text);

    console.log("Parsed image leads:", leads);

    if (!leads.length) {
      return res.status(400).json({
        success: false,
        message: "No valid leads found in image",
      });
    }

       // 3. Save leads
    const savedLeads = await saveUserLeads({
      clerkUserId,
      leads,
    });

    // Response 
        return res.status(200).json({
      success: true,
      message: "Image OCR completed successfully",
      file: {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
      },
    });
        
        
    } catch (error) {
        next(error)
    }
}