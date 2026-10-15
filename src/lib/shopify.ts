// Product data comes live from floukaa.com (WooCommerce Store API) via server functions.
import { fetchProduct, fetchProducts } from "./floukaa.functions";

export const STORE_URL = "https://floukaa.com";
export type Money = { amount: string; currencyCode: string };
export type ShopifyVariant = { id: string; title: string; price: Money; availableForSale: boolean; selectedOptions: Array<{ name: string; value: string }> };
export type ShopifyProduct = {
  id: string; title: string; description: string; handle: string; productType: string; tags: string[];
  priceRange: { minVariantPrice: Money }; compareAtPrice?: Money | null;
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ name: string; values: string[] }>;
};

export async function getProducts(first = 24, query?: string): Promise<ShopifyProduct[]> {
  return fetchProducts({ data: { first, ...(query ? { query } : {}) } });
}
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  return fetchProduct({ data: { handle } });
}
export function formatCurrency(money: Money) {
  return `${Number(money.amount).toLocaleString("en-US")} ${money.currencyCode === "EGP" ? "EGP" : money.currencyCode}`;
}
