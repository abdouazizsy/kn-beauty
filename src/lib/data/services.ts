import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { useMockStore } from "@/lib/mock/store";
import type { Service } from "@/types/service";

const COLLECTION = "services";

export async function listServices(): Promise<Service[]> {
  if (!isFirebaseConfigured) {
    return [...useMockStore.getState().services].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }
  const snap = await getDocs(query(collection(db!, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Service);
}

export async function getService(id: string): Promise<Service | null> {
  if (!isFirebaseConfigured) {
    return useMockStore.getState().services.find((s) => s.id === id) ?? null;
  }
  const snap = await getDoc(doc(db!, COLLECTION, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Service) : null;
}

export async function createService(input: Omit<Service, "id" | "createdAt">): Promise<Service> {
  const createdAt = new Date().toISOString();
  if (!isFirebaseConfigured) {
    const service: Service = { ...input, id: `svc-${Date.now()}`, createdAt };
    useMockStore.getState().addService(service);
    return service;
  }
  const ref = await addDoc(collection(db!, COLLECTION), { ...input, createdAt });
  return { ...input, id: ref.id, createdAt };
}

export async function updateService(id: string, patch: Partial<Service>): Promise<void> {
  if (!isFirebaseConfigured) {
    useMockStore.getState().updateService(id, patch);
    return;
  }
  await updateDoc(doc(db!, COLLECTION, id), patch);
}

export async function deleteService(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    useMockStore.getState().deleteService(id);
    return;
  }
  await deleteDoc(doc(db!, COLLECTION, id));
}
