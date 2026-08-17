import {
  createUserLead,
  getUserLeads,
  deleteUserLead,
} from "../services/leads.service.js";

export const createLead = async (req, res, next) => {
  try {
    const clerkUserId = req.userId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const { name, phone, location } = req.body || {};

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const lead = await createUserLead({
      clerkUserId,
      name: name?.trim() || null,
      phone: phone.trim(),
      location: location?.trim() || null,
    });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const clerkUserId = req.userId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const leads = await getUserLeads(clerkUserId);

    return res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: leads,
    });
  } catch (error) {
    next(error);
  }
}


export const deleteLead = async (req, res, next) => {
  try {
    const clerkUserId = req.userId;
    const { id } = req.params;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Lead ID is required",
      });
    }

    const deletedLead = await deleteUserLead({
      leadId: id,
      clerkUserId,
    });

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: deletedLead,
    });
  } catch (error) {
    next(error);
  }
};