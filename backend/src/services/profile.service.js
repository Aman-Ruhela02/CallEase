import {
  createProfile,
  getProfileByClerkId,
} from "../repositories/profile.repository.js";

export const createUserProfile = async ({ clerkUserId, name, email }) => {
  const profile = await createProfile({
    clerkUserId,
    name,
    email,
  });

  return profile;
};

export const getUserProfile = async (clerkUserId) => {
  const profile = await getProfileByClerkId(clerkUserId);

  return profile;
};
