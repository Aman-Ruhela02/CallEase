import { parseCSV } from "../services/csv.service.js";
import { saveUserLeads } from "../services/leads.service.js";

export const uploadCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    const clerkUserId = req.userId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const leads = await parseCSV(req.file.buffer);

    const validRows = leads.filter(
      (lead) => lead.name || lead.phone || lead.location,
    );

    if (!validRows.length) {
      return res.status(400).json({
        success: false,
        message: "CSV file contains no lead data",
      });
    }

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
      message: "CSV uploaded and leads saved successfully",
      count: savedLeads.length,
      data: savedLeads,
    });
  } catch (error) {
    console.log("CSV upload error:", error);

    next(error);
  }
};
