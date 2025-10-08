import { api } from "./client";
import { User } from "@/Types/User";

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  profilePictureUrl?: string | null;
}

export const updateMyProfile = async (payload: UpdateProfilePayload) => {
  const res = await api.put("/user/me", payload);
  if (res.status !== 200) throw new Error("Failed to update profile");
  return res.data as User;
};
