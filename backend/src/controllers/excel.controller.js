import { parseExcel } from "../services/excel.service.js";
import { saveUserLeads } from "../services/leads.service.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { mapLeadRow } from "../utils/leadMapper.js";

export const uploadExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, "Excel file is required", 400);
    }
    const clerkUserId = req.userId;
    if (!clerkUserId) {
      return errorResponse(res, "User is not authenticated", 401);
    }
    const rows = parseExcel(req.file.buffer);
    if (!rows.length) {
      return errorResponse(res, "Excel file is empty", 400);
    }
    const leads = rows.map((row) => mapLeadRow(row));
    // Remove completely empty rows
    const validRows = leads.filter((lead) => lead.name || lead.phone || lead.location);
    if (!validRows.length) {
      return errorResponse(res, "No lead data found in Excel file", 400);
    }
    // Phone is required
    const invalidLeads = validRows.filter((lead) => !lead.phone);
    if (invalidLeads.length > 0) {
      return errorResponse(res, "Some rows are missing phone numbers", 400, { invalidCount: invalidLeads.length });
    }
    const savedLeads = await saveUserLeads({ clerkUserId, leads: validRows });
    return successResponse(res, { count: savedLeads.length, data: savedLeads }, "Excel uploaded and leads saved successfully", 201);
  } catch (error) {
    console.log("Excel upload error:", error);

    next(error);
  }
};
