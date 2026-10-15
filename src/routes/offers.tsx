import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/store/catalog-page";
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/offers")({ head: () => meta("العروض — Floukaa", "خصومات حتى 50% على إكسسوارات مختارة."), component: () => <CatalogPage title="خصومات حتى 50%" query="tag:sale" /> });
