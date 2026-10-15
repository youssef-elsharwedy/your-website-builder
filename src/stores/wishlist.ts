import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ShopifyProduct } from "@/lib/shopify";
type S = { items: ShopifyProduct[]; toggle(p: ShopifyProduct): void; has(id: string): boolean };
export const useWishlist = create<S>()(persist((set, get) => ({ items: [], toggle: p => set({ items: get().items.some(i => i.id === p.id) ? get().items.filter(i => i.id !== p.id) : [...get().items, p] }), has: id => get().items.some(i => i.id === id) }), { name: "floukaa-wishlist", storage: createJSONStorage(() => localStorage), partialize: s => ({ items: s.items }) as S }));
