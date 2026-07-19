import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { useMockStore } from "@/lib/mock/store";
import type { GalleryItem } from "@/types/gallery";

const COLLECTION = "gallery";

export async function listGalleryItems(): Promise<GalleryItem[]> {
  if (!isFirebaseConfigured) {
    return [...useMockStore.getState().gallery].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }
  const snap = await getDocs(query(collection(db!, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryItem);
}

export async function createGalleryItem(input: Omit<GalleryItem, "id" | "createdAt">): Promise<GalleryItem> {
  const createdAt = new Date().toISOString();
  if (!isFirebaseConfigured) {
    const item: GalleryItem = { ...input, id: `gal-${Date.now()}`, createdAt };
    useMockStore.getState().addGalleryItem(item);
    return item;
  }
  const ref = await addDoc(collection(db!, COLLECTION), { ...input, createdAt });
  return { ...input, id: ref.id, createdAt };
}

export async function updateGalleryItem(id: string, patch: Partial<GalleryItem>): Promise<void> {
  if (!isFirebaseConfigured) {
    useMockStore.getState().updateGalleryItem(id, patch);
    return;
  }
  await updateDoc(doc(db!, COLLECTION, id), patch);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    useMockStore.getState().deleteGalleryItem(id);
    return;
  }
  await deleteDoc(doc(db!, COLLECTION, id));
}
