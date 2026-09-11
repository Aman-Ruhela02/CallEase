import { extractTextFromImage } from "../services/ocr.service.js";
import { parseImageLeads } from "../services/imageLeadParser.service.js";
import { saveUserLeads } from "../services/leads.service.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, "Image file is required", 400);
    }
    const clerkUserId = req.userId;
    if (!clerkUserId) {
      return errorResponse(res, "User is not authenticated", 401);
    }
    // 1. OCR
    const text = await extractTextFromImage(req.file.buffer);
    if (!text.trim()) {
      return errorResponse(res, "No text detected in image", 400);
    }
    // 2. Parse OCR text
    const leads = parseImageLeads(text);
    if (!leads.length) {
      return errorResponse(res, "No valid leads found in image", 400);
    }
    // 3. Save leads
    const savedLeads = await saveUserLeads({ clerkUserId, leads });
    return successResponse(res, {
        count: savedLeads.length,
        data: savedLeads,
        file: {
          name: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype,
        }
      },
      "Image OCR completed successfully",
    );
  } catch (error) {
    next(error);
  }
};
