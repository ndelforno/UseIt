import { ReservationStatus } from "./Constants";

export interface ReservationToolSummary {
  id: string;
  name: string;
  imageUrl?: string;
  price: string;
  area: string;
}

export interface Reservation {
  id: string;
  toolId: string;
  startDate: string; // ISO
  endDate: string; // ISO
  status: string;
  tool: ReservationToolSummary;
}

export interface ToolReservation {
  id: string;
  toolId: string;
  startDate: string; // ISO
  endDate: string; // ISO
  status: ReservationStatus;
}
