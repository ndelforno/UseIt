import { api } from "./client";
import { User } from "@/Types/User";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  if (res.status !== 200) throw new Error("Login failed");
  const token = (res.data?.token ?? res.data?.Token) as string;
  if (!token) throw new Error("Token missing in response");
  return token;
};

export const registerUser = async (email: string, password: string) => {
  const res = await api.post("/auth/register", { email, password });
  if (res.status !== 200) throw new Error("Register failed");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/user/me");
  if (res.status !== 200) throw new Error("Failed to fetch user");
  return res.data as User;
};
