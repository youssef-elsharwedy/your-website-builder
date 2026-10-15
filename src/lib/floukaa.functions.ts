import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BASE = "https://floukaa.com/wp-json/wc/store/v1";
const CAT_IDS: Record<string, number> = { necklaces: 207, bracelets: 209, earrings: 255, anklets: 208, rings: 262, kids: 309 };

type WooImage = { src: string; alt: string };
type WooProduct = {
  id: number; name: string; slug: string; description: string; short_description: string; on_sale: boolean;
  prices: { price: string; regular_price: string; currency_code: string };
  images: WooImage[]; categories: Array<{ name: string; slug: string }>; tags: Array<{ slug: string }>;
  attributes: Array<{ name: string; has_variations: boolean; terms: Array<{ name: string; slug: string }> }>;
  variations: Array<{ id: number; attributes: Array<{ name: string; value: string }> }>;
  is_in_stock: boolean;
};

const strip = (h: string) => h.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&#8211;/g, "–").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

function map(p: WooProduct) {
  const price = { amount: p.prices.price, currencyCode: p.prices.currency_code || "EGP" };
  const compare = p.on_sale ? { amount: p.prices.regular_price, currencyCode: price.currencyCode } : null;
  const varAttrs = p.attributes.filter((a) => a.has_variations);
  const variants = p.variations.length
    ? p.variations.map((v) => ({
        id: String(v.id), availableForSale: p.is_in_stock, price,
        ...(() => {
          const opts = v.attributes.map((a) => {
            const attr = varAttrs.find((x) => x.name.toLowerCase() === a.name.toLowerCase()) ?? varAttrs[0];
            return { name: attr?.name ?? a.name, value: attr?.terms.find((t) => t.slug === a.value)?.name ?? a.value };
          });
          return { title: opts.map((o) => o.value).join(" / ") || "Default", selectedOptions: opts };
        })(),
      }))
    : [{ id: String(p.id), title: "Default Title", availableForSale: p.is_in_stock, price, selectedOptions: [] }];
  return {
    id: String(p.id), title: strip(p.name), handle: p.slug,
    description: strip(p.description || p.short_description),
    productType: p.categories[0]?.name ?? "", tags: [...p.categories.map((c) => c.slug), ...p.tags.map((t) => t.slug)],
    priceRange: { minVariantPrice: price }, compareAtPrice: compare,
    images: { edges: p.images.map((i) => ({ node: { url: i.src, altText: i.alt || null } })) },
    variants: { edges: variants.map((node) => ({ node })) },
    options: varAttrs.map((a) => ({ name: a.name, values: a.terms.map((t) => t.name) })),
  };
}

async function woo(path: string) {
  const res = await fetch(BASE + path, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("تعذر الاتصال بالمتجر");
  return res.json();
}

export function buildParams(first: number, query?: string) {
  const sp = new URLSearchParams({ per_page: String(Math.min(first, 100)) });
  const q = query?.trim();
  if (!q) return sp;
  if (q === "tag:new") sp.set("orderby", "date");
  else if (q === "tag:featured") sp.set("featured", "true");
  else if (q === "tag:sale") sp.set("on_sale", "true");
  else if (q === "tag:best") sp.set("orderby", "popularity");
  else if (q.startsWith("tag:")) { const s = q.slice(4); const id = /^c\d+$/.test(s) ? Number(s.slice(1)) : CAT_IDS[s]; if (id) sp.set("category", String(id)); }
  else sp.set("search", q);
  return sp;
}

export const fetchProducts = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ first: z.number().int().min(1).max(100), query: z.string().max(200).optional() }).parse(d))
  .handler(async ({ data }) => {
    const list = (await woo("/products?" + buildParams(data.first, data.query).toString())) as WooProduct[];
    return list.map(map);
  });

export const fetchProduct = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ handle: z.string().min(1).max(300) }).parse(d))
  .handler(async ({ data }) => {
    const list = (await woo("/products?slug=" + encodeURIComponent(data.handle))) as Array<WooProduct & { type: string; parent: number }>;
    let p = list.find((x) => x.type !== "variation") ?? list[0];
    if (p && p.type === "variation" && p.parent) p = await woo("/products/" + p.parent);
    return p ? map(p) : null;
  });

export const CATALOG_CATEGORIES = CAT_IDS;

const catalogSchema = z.object({
  base: z.string().max(200).optional(),
  page: z.number().int().min(1).max(500).default(1),
  perPage: z.number().int().min(1).max(100).default(24),
  sort: z.enum(["new", "popular", "price-asc", "price-desc", "title"]).default("new"),
  category: z.string().max(40).optional(),
  onSale: z.boolean().optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  search: z.string().max(200).optional(),
});
export type CatalogParams = z.input<typeof catalogSchema>;

const SORTS = { new: ["date", "desc"], popular: ["popularity", "desc"], "price-asc": ["price", "asc"], "price-desc": ["price", "desc"], title: ["title", "asc"] } as const;

export const fetchCatalog = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => catalogSchema.parse(d))
  .handler(async ({ data }) => {
    const sp = buildParams(data.perPage, data.base);
    sp.set("page", String(data.page));
    if (!(data.base === "tag:best" && data.sort === "new")) { const [o, d] = SORTS[data.sort]; sp.set("orderby", o); sp.set("order", d); }
    if (data.category && CAT_IDS[data.category]) sp.set("category", String(CAT_IDS[data.category]));
    if (data.onSale) sp.set("on_sale", "true");
    if (data.minPrice != null) sp.set("min_price", String(data.minPrice));
    if (data.maxPrice != null) sp.set("max_price", String(data.maxPrice));
    if (data.search?.trim()) sp.set("search", data.search.trim());
    const res = await fetch(BASE + "/products?" + sp.toString(), { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("تعذر الاتصال بالمتجر");
    const list = (await res.json()) as WooProduct[];
    return { products: list.map(map), total: Number(res.headers.get("x-wp-total") ?? list.length), totalPages: Number(res.headers.get("x-wp-totalpages") ?? 1) };
  });
