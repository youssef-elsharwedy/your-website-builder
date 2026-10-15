import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/store/catalog-page";
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/new-arrivals")({ head: () => meta("وصل حديثًا — Floukaa", "أحدث تشكيلات فلوكة."), component: () => <CatalogPage title="وصل حديثًا" query="tag:new" /> });
