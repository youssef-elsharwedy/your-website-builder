import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/store/catalog-page";
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/best-sellers")({ head: () => meta("الأكثر مبيعًا — Floukaa", "القطع المفضلة عند عميلات فلوكة."), component: () => <CatalogPage title="الأكثر مبيعًا" query="tag:best" /> });
