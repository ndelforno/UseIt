import { api } from "./client";
import { Reservation, ToolReservation } from "../Types/Reservation";
import { ReservationStatus } from "@/Types/Constants";

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
  return res.data;
};

export const fetchMyReservations = async () => {
  const res = await api.get("/reservation/my");
  if (res.status !== 200) throw new Error("Failed to fetch reservations");
  return res.data as Reservation[];
};

export const fetchToolReservations = async (toolId: string | number) => {
  const res = await api.get(`/reservation/tool/${toolId}`);
  if (res.status !== 200) throw new Error("Failed to fetch tool reservations");
  return res.data as ToolReservation[];
};

export const updateReservationStatus = async (
  id: number | string,
  status: ReservationStatus
) => {
  const res = await api.post(`/reservation/${id}/status`, { status });
  if (res.status !== 200) throw new Error("Failed to update reservation status");
  return res.data as Reservation;
};

