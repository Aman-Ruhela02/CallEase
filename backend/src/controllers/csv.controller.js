import { parseCSV } from "../services/csv.service.js";
import { saveUserLeads } from "../services/leads.service.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const uploadCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, "CSV file is required", 400);
    }
    const clerkUserId = req.userId;
    if (!clerkUserId) {
      return errorResponse(res, "User is not authenticated", 401);
    }
    const leads = await parseCSV(req.file.buffer);
    const validRows = leads.filter((lead) => lead.name || lead.phone || lead.location)
    if (!validRows.length) {
      return errorResponse(res, "CSV file contains no lead data", 400);
    }
    const invalidLeads = validRows.filter((lead) => !lead.phone);
    if (invalidLeads.length > 0) {
      return errorResponse(res, "Some rows are missing phone numbers", 400, { invalidCount: invalidLeads.length });
    }
    const savedLeads = await saveUserLeads({ clerkUserId, leads: validRows });
    return successResponse(res, { count: savedLeads.length, data: savedLeads }, "CSV uploaded and leads saved successfully", 201);
  } catch (error) {
    next(error);
  }
};
