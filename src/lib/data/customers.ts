import { collection, getDocs, query, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { useMockStore } from "@/lib/mock/store";
import type { AppUser } from "@/types/user";
import { listAppointments } from "./appointments";
import { listOrders } from "./orders";

export interface CustomerOverview {
  user: AppUser;
  totalOrders: number;
  totalAppointments: number;
  totalSpent: number;
}

export async function listCustomers(): Promise<AppUser[]> {
  if (!isFirebaseConfigured) {
    return useMockStore.getState().users.filter((u) => u.role === "cliente");
  }
  const snap = await getDocs(query(collection(db!, "users"), where("role", "==", "cliente")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AppUser);
}

export async function listCustomerOverviews(): Promise<CustomerOverview[]> {
  const [customers, appointments, orders] = await Promise.all([
    listCustomers(),
    listAppointments(),
    listOrders(),
  ]);

  return customers.map((user) => {
    const userAppointments = appointments.filter((a) => a.userId === user.id);
    const userOrders = orders.filter((o) => o.userId === user.id);
    const spentOnOrders = userOrders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const spentOnAppointments = userAppointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((sum, a) => sum + a.servicePrice, 0);

    return {
      user,
      totalOrders: userOrders.length,
      totalAppointments: userAppointments.length,
      totalSpent: spentOnOrders + spentOnAppointments,
    };
  });
}
