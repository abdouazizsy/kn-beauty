import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { useMockStore } from "@/lib/mock/store";
import type { Transaction } from "@/types/transaction";

const COLLECTION = "transactions";

export async function listTransactions(): Promise<Transaction[]> {
  if (!isFirebaseConfigured) {
    return [...useMockStore.getState().transactions].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }
  const snap = await getDocs(query(collection(db!, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Transaction);
}

export async function createTransaction(input: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
  const createdAt = new Date().toISOString();
  if (!isFirebaseConfigured) {
    const transaction: Transaction = { ...input, id: `txn-${Date.now()}`, createdAt };
    useMockStore.getState().addTransaction(transaction);
    return transaction;
  }
  const ref = await addDoc(collection(db!, COLLECTION), { ...input, createdAt });
  return { ...input, id: ref.id, createdAt };
}

export async function deleteTransaction(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    useMockStore.getState().deleteTransaction(id);
    return;
  }
  await deleteDoc(doc(db!, COLLECTION, id));
}
