import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/store/catalog-page";
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/shop")({ head: () => meta("كل المنتجات — Floukaa", "تصفحي كل إكسسوارات وهدايا فلوكة."), component: () => <CatalogPage /> });
