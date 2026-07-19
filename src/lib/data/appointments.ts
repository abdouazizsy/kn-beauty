import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { useMockStore } from "@/lib/mock/store";
import type { Appointment } from "@/types/appointment";

const COLLECTION = "appointments";

export async function listAppointments(): Promise<Appointment[]> {
  if (!isFirebaseConfigured) {
    return [...useMockStore.getState().appointments].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }
  const snap = await getDocs(query(collection(db!, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment);
}

export async function listAppointmentsForUser(userId: string): Promise<Appointment[]> {
  if (!isFirebaseConfigured) {
    return useMockStore
      .getState()
      .appointments.filter((a) => a.userId === userId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  const snap = await getDocs(
    query(collection(db!, COLLECTION), where("userId", "==", userId), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment);
}

export async function createAppointment(
  input: Omit<Appointment, "id" | "createdAt" | "status" | "depositStatus">
): Promise<Appointment> {
  const createdAt = new Date().toISOString();
  const base = { ...input, status: "PENDING" as const, depositStatus: "NONE" as const, createdAt };
  if (!isFirebaseConfigured) {
    const appointment: Appointment = { ...base, id: `apt-${Date.now()}` };
    useMockStore.getState().addAppointment(appointment);
    return appointment;
  }
  const ref = await addDoc(collection(db!, COLLECTION), base);
  return { ...base, id: ref.id };
}

export async function updateAppointment(id: string, patch: Partial<Appointment>): Promise<void> {
  if (!isFirebaseConfigured) {
    useMockStore.getState().updateAppointment(id, patch);
    return;
  }
  await updateDoc(doc(db!, COLLECTION, id), patch);
}

export async function deleteAppointment(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    useMockStore.getState().deleteAppointment(id);
    return;
  }
  await deleteDoc(doc(db!, COLLECTION, id));
}
