import {
  createUserLead,
  getUserLeads,
  deleteUserLead,
} from "../services/leads.service.js";

export const createLead = async (req, res, next) => {
  try {
   
    const { name, phone, location } = req.body || {};

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const lead = await createUserLead({
      clerkUserId: req.userId,
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
    const leads = await getUserLeads(req.userId);

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
    
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Lead ID is required",
      });
    }

    const deletedLead = await deleteUserLead({
      leadId: id,
      clerkUserId: req.userId
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