import axios from "axios";
import { Tool } from "./Types/Tool";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  if (res.status !== 200) throw new Error("Login failed");
  const data = await res.data;
  return data.token;
};

export const registerUser = async (email: string, password: string) => {
  const res = await api.post("/auth/register", { email, password });
  if (res.status !== 200) throw new Error("Register failed");
  return res.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");  
  const res = await api.get("/user/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 200) throw new Error("Failed to fetch user");
  return res.data;
};

export const fetchTools = async () => {
  const res = await api.get("/tool");
  if (res.status !== 200) throw new Error("Failed to fetch tools");
  return res.data;
};

export const addTool = async (tool: Tool) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const res = await api.post("/tool/createTool", tool, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 201) throw new Error("Failed to add tool");
  return res.data;
};
