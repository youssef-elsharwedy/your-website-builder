import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/store/catalog-page";
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s['q'] === "string" ? s['q'] : "" }),
  head: () => meta("بحث — Floukaa", "ابحثي في منتجات فلوكة."),
  component: () => { const { q } = Route.useSearch(); return <CatalogPage key={q} title={q ? `نتائج: ${q}` : "بحث"} {...(q ? { search: q } : {})} />; },
});
