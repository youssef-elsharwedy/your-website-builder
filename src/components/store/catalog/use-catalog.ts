import { useCallback, useEffect, useState } from "react";
import { fetchCatalog, type CatalogParams } from "@/lib/floukaa.functions";
import type { ShopifyProduct } from "@/lib/shopify";

export type SortKey = "new" | "popular" | "price-asc" | "price-desc" | "title";
export type CatalogState = { page: number; sort: SortKey; category: string; price: string; onSale: boolean; search: string };

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "new", label: "الأحدث" },
  { value: "popular", label: "الأكثر مبيعًا" },
  { value: "price-asc", label: "السعر: من الأقل" },
  { value: "price-desc", label: "السعر: من الأعلى" },
  { value: "title", label: "الاسم (أ-ي)" },
];
export const CATEGORY_OPTIONS = [
  { value: "all", label: "كل الأقسام" },
  { value: "necklaces", label: "سلاسل" },
  { value: "bracelets", label: "أساور" },
  { value: "earrings", label: "حلقان" },
  { value: "anklets", label: "خلخال" },
  { value: "rings", label: "خواتم" },
  { value: "kids", label: "أطفال" },
];
export const PRICE_OPTIONS = [
  { value: "all", label: "كل الأسعار", min: undefined, max: undefined },
  { value: "0-100", label: "أقل من 100 EGP", min: 0, max: 100 },
  { value: "100-200", label: "100 – 200 EGP", min: 100, max: 200 },
  { value: "200-400", label: "200 – 400 EGP", min: 200, max: 400 },
  { value: "400+", label: "أكثر من 400 EGP", min: 400, max: undefined },
] as const;

export const DEFAULT_STATE: CatalogState = { page: 1, sort: "new", category: "all", price: "all", onSale: false, search: "" };
export const PER_PAGE = 24;

/** Central catalog state: every listing page uses this one hook for search, sort, filters and pagination. */
export function useCatalog(base?: string, initial: Partial<CatalogState> = {}) {
  const [state, setState] = useState<CatalogState>({ ...DEFAULT_STATE, ...initial });
  const [data, setData] = useState<{ products: ShopifyProduct[]; total: number; totalPages: number }>({ products: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Any filter change resets to page 1; page changes keep filters.
  const update = useCallback((patch: Partial<CatalogState>) => setState((s) => ({ ...s, ...patch, page: patch.page ?? 1 })), []);
  const reset = useCallback(() => setState({ ...DEFAULT_STATE, ...initial, search: "" }), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const price = PRICE_OPTIONS.find((p) => p.value === state.price);
    const params: CatalogParams = {
      page: state.page, perPage: PER_PAGE, sort: state.sort,
      ...(base ? { base } : {}),
      ...(state.category !== "all" ? { category: state.category } : {}),
      ...(state.onSale ? { onSale: true } : {}),
      ...(price?.min != null ? { minPrice: price.min } : {}),
      ...(price?.max != null ? { maxPrice: price.max } : {}),
      ...(state.search ? { search: state.search } : {}),
    };
    fetchCatalog({ data: params })
      .then((r) => alive && setData(r))
      .catch(() => alive && setData({ products: [], total: 0, totalPages: 1 }))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [base, state]);

  const activeCount = [state.category !== (initial.category ?? "all"), state.price !== "all", state.onSale, !!state.search].filter(Boolean).length;
  return { state, update, reset, loading, activeCount, ...data };
}
