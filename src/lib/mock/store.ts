import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Service } from "@/types/service";
import type { Product } from "@/types/product";
import type { GalleryItem } from "@/types/gallery";
import type { AppUser } from "@/types/user";
import type { Appointment } from "@/types/appointment";
import type { Order } from "@/types/order";
import type { Transaction } from "@/types/transaction";
import {
  SEED_SERVICES,
  SEED_PRODUCTS,
  SEED_GALLERY,
  SEED_USERS,
  SEED_APPOINTMENTS,
  SEED_ORDERS,
  SEED_TRANSACTIONS,
} from "./seed-data";

interface MockAuthCredential {
  userId: string;
  password: string;
}

interface MockState {
  services: Service[];
  products: Product[];
  gallery: GalleryItem[];
  users: AppUser[];
  appointments: Appointment[];
  orders: Order[];
  transactions: Transaction[];
  credentials: MockAuthCredential[];
  currentUserId: string | null;
  hasHydrated: boolean;

  setHasHydrated: (v: boolean) => void;
  setCurrentUser: (userId: string | null) => void;
  addUser: (user: AppUser, password: string) => void;
  updateUser: (userId: string, patch: Partial<AppUser>) => void;
  checkCredential: (phone: string, password: string) => AppUser | null;

  addService: (service: Service) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  deleteService: (id: string) => void;

  addProduct: (product: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  addOrder: (order: Order) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;

  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;

  addGalleryItem: (item: GalleryItem) => void;
  updateGalleryItem: (id: string, patch: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
}

export const useMockStore = create<MockState>()(
  persist(
    (set, get) => ({
      services: SEED_SERVICES,
      products: SEED_PRODUCTS,
      gallery: SEED_GALLERY,
      users: SEED_USERS,
      appointments: SEED_APPOINTMENTS,
      orders: SEED_ORDERS,
      transactions: SEED_TRANSACTIONS,
      credentials: [
        { userId: "admin-demo", password: "admin123" },
        { userId: "cliente-demo", password: "cliente123" },
      ],
      currentUserId: null,
      hasHydrated: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),
      setCurrentUser: (userId) => set({ currentUserId: userId }),

      addUser: (user, password) =>
        set((s) => ({
          users: [...s.users, user],
          credentials: [...s.credentials, { userId: user.id, password }],
        })),

      updateUser: (userId, patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
        })),

      checkCredential: (phone, password) => {
        const digits = phone.replace(/[^\d]/g, "");
        const user = get().users.find((u) => u.phone.replace(/[^\d]/g, "") === digits);
        if (!user) return null;
        const cred = get().credentials.find((c) => c.userId === user.id);
        if (!cred || cred.password !== password) return null;
        return user;
      },

      addService: (service) => set((s) => ({ services: [service, ...s.services] })),
      updateService: (id, patch) =>
        set((s) => ({ services: s.services.map((sv) => (sv.id === id ? { ...sv, ...patch } : sv)) })),
      deleteService: (id) => set((s) => ({ services: s.services.filter((sv) => sv.id !== id) })),

      addProduct: (product) => set((s) => ({ products: [product, ...s.products] })),
      updateProduct: (id, patch) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      addAppointment: (appointment) => set((s) => ({ appointments: [appointment, ...s.appointments] })),
      updateAppointment: (id, patch) =>
        set((s) => ({
          appointments: s.appointments.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      deleteAppointment: (id) => set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) })),

      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      updateOrder: (id, patch) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) })),

      addTransaction: (transaction) => set((s) => ({ transactions: [transaction, ...s.transactions] })),
      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      addGalleryItem: (item) => set((s) => ({ gallery: [item, ...s.gallery] })),
      updateGalleryItem: (id, patch) =>
        set((s) => ({ gallery: s.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      deleteGalleryItem: (id) => set((s) => ({ gallery: s.gallery.filter((g) => g.id !== id) })),
    }),
    {
      name: "kn-beauty-mock-backend",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
