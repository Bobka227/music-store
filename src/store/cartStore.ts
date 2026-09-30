import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                  : i,
              ),
            };
          }
          const { id, name, brand, price, image, stock } = product;
          return {
            items: [
              ...state.items,
              {
                id,
                name,
                brand,
                price,
                image,
                stock,
                quantity: Math.min(quantity, stock),
              },
            ],
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
              : i,
          ),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    { name: "music-store-cart" },
  ),
);

// Čisté funkce – snadno testovatelné
export const getTotalCount = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0);
export const getTotalPrice = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);
