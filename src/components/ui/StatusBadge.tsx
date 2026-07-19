import clsx from "clsx";
import { APPOINTMENT_STATUS_LABELS, type AppointmentStatus } from "@/types/appointment";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/order";

const APPOINTMENT_STYLES: Record<AppointmentStatus, string> = {
  PENDING: "bg-nude-100 text-ink-700",
  DEPOSIT_RECEIVED: "bg-gold-300/40 text-gold-600",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-ink-900 text-cream",
  CANCELLED: "bg-blush-100 text-blush-500",
};

const ORDER_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-nude-100 text-ink-700",
  CONFIRMED: "bg-gold-300/40 text-gold-600",
  PREPARING: "bg-blush-100 text-blush-500",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-ink-900/10 text-ink-500",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", APPOINTMENT_STYLES[status])}>
      {APPOINTMENT_STATUS_LABELS[status]}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", ORDER_STYLES[status])}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
