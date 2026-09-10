import {
  createUserLead,
  getUserLeads,
  deleteUserLead,
} from "../services/leads.service.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const createLead = async (req, res, next) => {
  try {
    const { name, phone, location } = req.body || {};
    if (!phone || !phone.trim()) {
      return errorResponse(res, "Phone number is required", 400);
    }
    const lead = await createUserLead({
      clerkUserId: req.userId,
      name: name?.trim() || null,
      phone: phone.trim(),
      location: location?.trim() || null,
    });
    return successResponse(res, lead, "Lead created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const leads = await getUserLeads(req.userId);
    return successResponse(res, leads, "Leads fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, "Lead ID is required", 400);
    }
    const deletedLead = await deleteUserLead({
      leadId: id,
      clerkUserId: req.userId,
    });
    return successResponse(res, deletedLead, "Lead deleted successfully");
  } catch (error) {
    next(error);
  }
};
