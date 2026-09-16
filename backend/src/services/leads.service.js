import {
  createLead,
  getLeadsByClerkId,
  deleteLeadById,
  getLeadCountByClerkId,
} from "../repositories/leads.repository.js";

export const createUserLead = async ({ clerkUserId, name, phone, location }) => {
  const lead = {
    clerk_user_id: clerkUserId,
    name,
    phone,
    location,
  };
  return await createLead(lead);
};

export const saveUserLeads = async ({ clerkUserId, leads }) => {
  const leadsWithUser = leads
    .filter((lead) => lead.phone)
    .map((lead) => ({
      clerk_user_id: clerkUserId,
      name: lead.name?.trim() || null,
      phone: lead.phone?.trim() || null,
      location: lead.location?.trim() || null,
    }));

  if (!leadsWithUser.length) {
    return { data: [], count: 0, skipped: 0 };
  }
  const data = await createLead(leadsWithUser);
  const savedLeads = data || []; // guard against null from ignoreDuplicates skipping all rows

  return {
    data: savedLeads,
    count: savedLeads.length,
    skipped: leadsWithUser.length - savedLeads.length,
  };
};

export const getUserLeads = async (clerkUserId) => {
  return await getLeadsByClerkId(clerkUserId);
};

export const deleteUserLead = async ({ leadId, clerkUserId }) => {
  return await deleteLeadById(leadId, clerkUserId);
};

export const getUserDashboard = async (clerkUserId) => {
  const totalLeads = await getLeadCountByClerkId(clerkUserId);
  return {
    totalLeads,
  };
};
