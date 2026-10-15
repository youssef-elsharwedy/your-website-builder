import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORE_URL, type Money, type ShopifyProduct } from "@/lib/shopify";

export type CartItem = { lineId: string | null; product: ShopifyProduct; variantId: string; variantTitle: string; price: Money; quantity: number; selectedOptions: Array<{ name: string; value: string }> };
type CartState = {
  items: CartItem[]; cartId: string | null; checkoutUrl: string | null; busy: boolean; drawerOpen: boolean;
  setDrawerOpen(v: boolean): void; addItem(item: Omit<CartItem, "lineId">): Promise<void>;
  updateQuantity(variantId: string, q: number): Promise<void>; removeItem(variantId: string): Promise<void>;
  clearCart(): void; syncCart(): Promise<void>;
};

// Checkout happens on floukaa.com: the link adds the first cart line there, then opens checkout.
function checkoutFor(items: CartItem[]) {
  const first = items[0];
  if (!first) return null;
  return `${STORE_URL}/checkout/?add-to-cart=${first.variantId}&quantity=${first.quantity}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [], cartId: null, checkoutUrl: null, busy: false, drawerOpen: false,
      setDrawerOpen: (v) => set({ drawerOpen: v }),
      clearCart: () => set({ items: [], checkoutUrl: null }),
      addItem: async (item) => {
        const items = get().items;
        const ex = items.find((i) => i.variantId === item.variantId);
        const next = ex ? items.map((i) => (i === ex ? { ...i, quantity: i.quantity + item.quantity } : i)) : [...items, { ...item, lineId: item.variantId }];
        set({ items: next, checkoutUrl: checkoutFor(next), drawerOpen: true });
      },
      updateQuantity: async (id, q) => {
        if (q <= 0) return get().removeItem(id);
        const next = get().items.map((i) => (i.variantId === id ? { ...i, quantity: q } : i));
        set({ items: next, checkoutUrl: checkoutFor(next) });
      },
      removeItem: async (id) => {
        const next = get().items.filter((i) => i.variantId !== id);
        set({ items: next, checkoutUrl: checkoutFor(next) });
      },
      syncCart: async () => {},
    }),
    { name: "floukaa-cart-v2", storage: createJSONStorage(() => localStorage), partialize: (s) => ({ items: s.items, checkoutUrl: s.checkoutUrl }) },
  ),
);
