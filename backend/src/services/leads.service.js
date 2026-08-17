import {
  createLead,
  getLeadsByClerkId,
  deleteLeadById,
  getLeadCountByClerkId,
} from "../repositories/leads.repository.js";

export const createUserLead = async ({
  clerkUserId,
  name,
  phone,
  location,
}) => {
  const lead = {
    clerk_user_id: clerkUserId,
    name,
    phone,
    location,
  };

  return await createLead(lead);
};

export const saveUserLeads = async ({
  clerkUserId,
  leads,
}) => {
  const leadsWithUser = leads.map((lead) => ({
    clerk_user_id: clerkUserId,
    name: lead.name,
    phone: lead.phone,
    location: lead.location,
  }));

  return await createLead(leadsWithUser);
};

export const getUserLeads = async (clerkUserId) => {
  return await getLeadsByClerkId(clerkUserId);
};

export const deleteUserLead = async ({
  leadId,
  clerkUserId,
}) => {
  return await deleteLeadById(leadId, clerkUserId);
};

export const getUserDashboard = async (clerkUserId) => {
  const totalLeads = await getLeadCountByClerkId(clerkUserId);

  return {
    totalLeads,
  };
};