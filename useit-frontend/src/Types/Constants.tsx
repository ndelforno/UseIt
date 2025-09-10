export const TOOL_CATEGORIES = [
  "Woodworking",
  "Renovation & Home Improvement",
  "Construction & Masonry",
  "Plumbing",
  "Electrical",
  "Gardening & Landscaping",
  "Automotive & Mechanical",
  "Painting & Finishing",
  "Safety & Support",
  "Other",
] as const;

export enum ReservationStatus {
  Pending = "Pending",
  Active = "Active",
  Cancelled = "Cancelled",
}
