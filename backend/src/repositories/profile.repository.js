import supabase from "../lib/supabase.js";

export const createProfile = async ({
  clerkUserId,
  name,
  email,
}) => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      clerk_user_id: clerkUserId,
      name,
      email,
    },
   {
    onConflict : "clerk_user_id",
   }
  )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export const getProfileByClerkId = async (clerkUserId)=>{
    const {data,error} = await supabase 
    .from("profiles")
    .select("*")
    .eq("clerk_user_id",clerkUserId)
    .single()

    if (error) {
    throw error;
  }

  return data;
}

