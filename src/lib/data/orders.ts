import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { useMockStore } from "@/lib/mock/store";
import type { Order } from "@/types/order";
import { decrementStock } from "./products";

const COLLECTION = "orders";

export async function listOrders(): Promise<Order[]> {
  if (!isFirebaseConfigured) {
    return [...useMockStore.getState().orders].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }
  const snap = await getDocs(query(collection(db!, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function listOrdersForUser(userId: string): Promise<Order[]> {
  if (!isFirebaseConfigured) {
    return useMockStore
      .getState()
      .orders.filter((o) => o.userId === userId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  const snap = await getDocs(
    query(collection(db!, COLLECTION), where("userId", "==", userId), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function createOrder(input: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
  const createdAt = new Date().toISOString();
  const base = { ...input, status: "PENDING" as const, createdAt };

  if (!isFirebaseConfigured) {
    const order: Order = { ...base, id: `ord-${Date.now()}` };
    useMockStore.getState().addOrder(order);
    // In mock mode there is no server: decrement stock directly.
    await Promise.all(input.products.map((item) => decrementStock(item.productId, item.quantity)));
    return order;
  }

  // Clientes cannot write to `products` directly (see firestore.rules) — stock is
  // decremented server-side by the `onOrderCreated` Cloud Function instead.
  const ref = await addDoc(collection(db!, COLLECTION), base);
  return { ...base, id: ref.id };
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  if (!isFirebaseConfigured) {
    useMockStore.getState().updateOrder(id, { status });
    return;
  }
  await updateDoc(doc(db!, COLLECTION, id), { status });
}
