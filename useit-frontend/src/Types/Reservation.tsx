import { ReservationStatus } from "./Constants";

export interface ReservationToolSummary {
  id: number | string;
  name: string;
  imageUrl?: string;
  price: string;
  area: string;
}

export interface Reservation {
  id: number;
  toolId: number;
  startDate: string; // ISO
  endDate: string; // ISO
  status: string;
  tool: ReservationToolSummary;
}

export interface ToolReservation {
  id: number;
  toolId: number;
  startDate: string; // ISO
  endDate: string; // ISO
  status: ReservationStatus;
}
