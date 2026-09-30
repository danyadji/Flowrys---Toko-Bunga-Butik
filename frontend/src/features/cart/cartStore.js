import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_QTY = 99;

// Keranjang belanja (M3-01). Hanya menyimpan productId dan jumlah;
// detail produk selalu dibaca dari katalog agar sinkron (M3-02).
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      add(productId, quantity = 1) {
        const items = [...get().items];
        const found = items.find((i) => i.productId === productId);
        if (found) {
          found.quantity = Math.min(MAX_QTY, found.quantity + quantity);
        } else {
          items.push({ productId, quantity: Math.min(MAX_QTY, Math.max(1, quantity)) });
        }
        set({ items });
      },

      setQty(productId, quantity) {
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(MAX_QTY, Math.max(1, quantity)) }
              : i,
          ),
        });
      },

      remove(productId) {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clear() {
        set({ items: [] });
      },

      totalQty() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: "flowrys.cart" },
  ),
);
