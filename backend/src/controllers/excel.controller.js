import { parseExcel } from "../services/excel.service.js";
import { saveUserLeads } from "../services/leads.service.js";
import { mapLeadRow } from "../utils/leadMapper.js";

export const uploadExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file is required",
      });
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

    const leads = rows.map((row) => mapLeadRow(row));

    console.log("Mapped Excel leads:", leads);

    // Remove completely empty rows
    const validRows = leads.filter(
      (lead) => lead.name || lead.phone || lead.location,
    );

    if (!validRows.length) {
      return res.status(400).json({
        success: false,
        message: "No lead data found in Excel file",
      });
    }

    // Phone is required
    const invalidLeads = validRows.filter((lead) => !lead.phone);

    if (invalidLeads.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some rows are missing phone numbers",
        invalidCount: invalidLeads.length,
      });
    }

    const savedLeads = await saveUserLeads({
      clerkUserId,
      leads: validRows,
    });

    return res.status(201).json({
      success: true,
      message: "Excel uploaded and leads saved successfully",
      count: savedLeads.length,
      data: savedLeads,
    });
  } catch (error) {
    console.log("Excel upload error:", error);

    next(error);
  }
}