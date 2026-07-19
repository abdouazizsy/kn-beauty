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
import type { Product } from "@/types/product";

const COLLECTION = "products";

export async function listProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured) {
    return [...useMockStore.getState().products].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }
  const snap = await getDocs(query(collection(db!, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured) {
    return useMockStore.getState().products.find((p) => p.id === id) ?? null;
  }
  const snap = await getDoc(doc(db!, COLLECTION, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
}

export async function createProduct(input: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const createdAt = new Date().toISOString();
  if (!isFirebaseConfigured) {
    const product: Product = { ...input, id: `prd-${Date.now()}`, createdAt };
    useMockStore.getState().addProduct(product);
    return product;
  }
  const ref = await addDoc(collection(db!, COLLECTION), { ...input, createdAt });
  return { ...input, id: ref.id, createdAt };
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<void> {
  if (!isFirebaseConfigured) {
    useMockStore.getState().updateProduct(id, patch);
    return;
  }
  await updateDoc(doc(db!, COLLECTION, id), patch);
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    useMockStore.getState().deleteProduct(id);
    return;
  }
  await deleteDoc(doc(db!, COLLECTION, id));
}

export async function decrementStock(id: string, quantity: number): Promise<void> {
  const product = await getProduct(id);
  if (!product) return;
  await updateProduct(id, { stock: Math.max(0, product.stock - quantity) });
}
