import { api } from "./client";
import { Reservation } from "../Types/Reservation";

export const reserveTool = async (params: {
  toolId: number | string;
  startDate: string; // ISO
  endDate: string; // ISO
}) => {
  const res = await api.post("/reservation", {
    toolId: Number(params.toolId),
    startDate: params.startDate,
    endDate: params.endDate,
  });
  if (res.status !== 201) throw new Error("Failed to reserve tool");
  return res.data as Reservation;
};

export const fetchMyReservations = async () => {
  const res = await api.get("/reservation/my");
  if (res.status !== 200) throw new Error("Failed to fetch reservations");
  return res.data as Reservation[];
};

