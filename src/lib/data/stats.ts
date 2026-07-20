import { listOrders } from "./orders";
import { listAppointments } from "./appointments";
import { listCustomers } from "./customers";
import { listTransactions } from "./transactions";
import type { Order } from "@/types/order";
import type { Appointment } from "@/types/appointment";

export interface MonthlyPoint {
  label: string;
  revenue: number;
  appointments: number;
}

export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  topProducts: { name: string; quantity: number }[];
  appointmentsToday: Appointment[];
  appointmentsThisWeek: Appointment[];
  popularServices: { name: string; count: number }[];
  homeVisits: number;
  studioVisits: number;
  monthlySeries: MonthlyPoint[];
}

function isSameMonth(dateStr: string, ref: Date) {
  const d = new Date(dateStr);
  return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
}

function revenueFromOrder(order: Order) {
  return order.status === "CANCELLED" ? 0 : order.totalAmount;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [orders, appointments, customers, transactions] = await Promise.all([
    listOrders(),
    listAppointments(),
    listCustomers(),
    listTransactions(),
  ]);

  const now = new Date();
  const totalRevenue =
    orders.reduce((s, o) => s + revenueFromOrder(o), 0) +
    appointments.filter((a) => a.status === "COMPLETED").reduce((s, a) => s + a.servicePrice, 0) +
    transactions.reduce((s, t) => s + t.amount, 0);

  const monthlyRevenue =
    orders.filter((o) => isSameMonth(o.createdAt, now)).reduce((s, o) => s + revenueFromOrder(o), 0) +
    appointments
      .filter((a) => a.status === "COMPLETED" && isSameMonth(a.createdAt, now))
      .reduce((s, a) => s + a.servicePrice, 0) +
    transactions.filter((t) => isSameMonth(t.createdAt, now)).reduce((s, t) => s + t.amount, 0);

  const productQty = new Map<string, number>();
  orders.forEach((o) =>
    o.products.forEach((item) => {
      productQty.set(item.productName, (productQty.get(item.productName) ?? 0) + item.quantity);
    })
  );
  const topProducts = [...productQty.entries()]
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const todayStr = now.toISOString().slice(0, 10);
  const appointmentsToday = appointments.filter((a) => a.date === todayStr);

  const weekFromNow = new Date(now);
  weekFromNow.setDate(now.getDate() + 7);
  const appointmentsThisWeek = appointments.filter((a) => {
    const d = new Date(a.date);
    return d >= now && d <= weekFromNow;
  });

  const serviceCount = new Map<string, number>();
  appointments.forEach((a) => serviceCount.set(a.serviceName, (serviceCount.get(a.serviceName) ?? 0) + 1));
  const popularServices = [...serviceCount.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const homeVisits = appointments.filter((a) => a.locationType === "domicile").length;
  const studioVisits = appointments.filter((a) => a.locationType === "studio").length;

  const monthlySeries: MonthlyPoint[] = Array.from({ length: 6 }).map((_, idx) => {
    const ref = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    const label = ref.toLocaleDateString("fr-FR", { month: "short" });
    const revenue =
      orders.filter((o) => isSameMonth(o.createdAt, ref)).reduce((s, o) => s + revenueFromOrder(o), 0) +
      transactions.filter((t) => isSameMonth(t.createdAt, ref)).reduce((s, t) => s + t.amount, 0);
    const appts = appointments.filter((a) => isSameMonth(a.createdAt, ref)).length;
    return { label, revenue, appointments: appts };
  });

  return {
    totalRevenue,
    monthlyRevenue,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    topProducts,
    appointmentsToday,
    appointmentsThisWeek,
    popularServices,
    homeVisits,
    studioVisits,
    monthlySeries,
  };
}
