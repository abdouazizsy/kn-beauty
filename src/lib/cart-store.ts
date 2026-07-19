import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderItem } from "@/types/order";

interface CartState {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  setQuantity: (productId: string, size: string | undefined, color: string | undefined, quantity: number) => void;
  clear: () => void;
}

function sameLine(a: OrderItem, productId: string, size?: string, color?: string) {
  return a.productId === productId && a.size === size && a.color === color;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find((i) => sameLine(i, item.productId, item.size, item.color));
          if (existing) {
            return {
              items: s.items.map((i) =>
                sameLine(i, item.productId, item.size, item.color)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      removeItem: (productId, size, color) =>
        set((s) => ({ items: s.items.filter((i) => !sameLine(i, productId, size, color)) })),
      setQuantity: (productId, size, color, quantity) =>
        set((s) => ({
          items: s.items
            .map((i) => (sameLine(i, productId, size, color) ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "kn-beauty-cart" }
  )
);
