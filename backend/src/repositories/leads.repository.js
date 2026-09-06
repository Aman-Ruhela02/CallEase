import supabase from "../lib/supabase.js";

export const createLead = async (leads) => {
  const { data, error } = await supabase
    .from("leads")
    .upsert(leads, {
      onConflict: "clerk_user_id,phone",
      ignoreDuplicates: true,
    })
    .select();

  if (error) {
    console.log("lead not creATED",error);
    
    throw error;
  }

  return data;
};
    
export const getLeadsByClerkId = async (clerkUserId) => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
};


export const deleteLeadById = async (leadId, clerkUserId) => {
  const { data, error } = await supabase
    .from("leads")
    .delete()
    .eq("id", leadId)
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export const getLeadCountByClerkId = async (clerkUserId) => {
  const { count, error } = await supabase
    .from("leads")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("clerk_user_id", clerkUserId);

  if (error) {
    throw error;
  }

  return count || 0;
};