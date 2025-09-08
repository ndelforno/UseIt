import { api, withMultipart } from "./client";
import { submitTool, Tool } from "../Types/Tool";

export const fetchTools = async () => {
  const res = await api.get("/tool");
  if (res.status !== 200) throw new Error("Failed to fetch tools");
  return res.data as Tool[];
};

export const fetchToolById = async (id: string | number) => {
  const res = await api.get(`/tool/${id}`);
  if (res.status !== 200) throw new Error("Failed to fetch tool");
  return res.data as Tool;
};

export const addTool = async (tool: submitTool) => {
  const res = await api.post("/tool/createTool", tool);
  if (res.status !== 201) throw new Error("Failed to add tool");
  return res.data as Tool;
};

export const updateTool = async (id: string | number, tool: submitTool) => {
  const res = await api.put(`/tool/${id}`, tool);
  if (res.status !== 204) throw new Error("Failed to update tool");
  return true;
};

export const fetchMyTools = async () => {
  const res = await api.get("/tool/myTools");
  if (res.status !== 200) throw new Error("Failed to fetch your tools");
  return res.data as Tool[];
};

export const deleteTool = async (id: string | number) => {
  const res = await api.delete(`/tool/${id}`);
  if (res.status !== 204) throw new Error("Failed to delete tool");
  return true;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await withMultipart().post("/upload/uploadImage", formData);
  if (res.status !== 200) throw new Error("Image upload failed");
  return res.data.imageUrl as string;
};

