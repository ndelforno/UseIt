import axios from "axios";
import { Tool } from "./Types/Tool";
import { Reservation } from "./Types/Reservation";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
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

export const fetchToolById = async (id: string | number) => {
  const res = await api.get(`/tool/${id}`);
  if (res.status !== 200) throw new Error("Failed to fetch tool");
  return res.data as Tool;
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

export const updateTool = async (id: string | number, tool: Tool) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const res = await api.put(`/tool/${id}`, tool, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 204) throw new Error("Failed to update tool");
  return true;
};

export const fetchMyTools = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const res = await api.get("/tool/myTools", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 200) throw new Error("Failed to fetch your tools");
  return res.data;
};

export const deleteTool = async (id: string | number) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const res = await api.delete(`/tool/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 204) throw new Error("Failed to delete tool");
  return true;
};

export const uploadImage = async (file: File) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/upload/uploadImage", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  if (res.status !== 200) throw new Error("Image upload failed");
  return res.data.imageUrl;
};

export const reserveTool = async (params: {
  toolId: number | string;
  startDate: string;
  endDate: string;
}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const res = await api.post(
    "/reservation",
    {
      toolId: Number(params.toolId),
      startDate: params.startDate,
      endDate: params.endDate,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status !== 201) throw new Error("Failed to reserve tool");
  return res.data;
};

export const fetchMyReservations = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const res = await api.get("/reservation/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 200) throw new Error("Failed to fetch reservations");
  return res.data as Reservation[];
};
