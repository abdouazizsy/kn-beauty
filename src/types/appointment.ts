export type LocationType = "studio" | "domicile";

export type AppointmentStatus =
  | "PENDING"
  | "DEPOSIT_RECEIVED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type DepositStatus = "NONE" | "SENT" | "RECEIVED";

export interface Appointment {
  id: string;
  userId: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string; // ISO date (yyyy-MM-dd)
  time: string; // HH:mm
  locationType: LocationType;
  address?: string;
  district?: string;
  gpsLocation?: string;
  depositAmount: number;
  depositStatus: DepositStatus;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: "Demande envoyée",
  DEPOSIT_RECEIVED: "Acompte reçu",
  CONFIRMED: "Confirmé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};
