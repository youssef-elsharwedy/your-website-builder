import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/store/catalog-page";
import { CATEGORIES } from "@/lib/categories";
export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => { const t = CATEGORIES.find(c => c.slug === params.slug)?.title ?? "تشكيلة"; return { meta: [{ title: `${t} — Floukaa` }, { name: "description", content: `تسوقي ${t} من فلوكة.` }, { property: "og:title", content: `${t} — Floukaa` }, { property: "og:description", content: `تسوقي ${t} من فلوكة.` }] }; },
  component: Cat,
});
function Cat() { const { slug } = Route.useParams(); const c = CATEGORIES.find(c => c.slug === slug); return <CatalogPage key={slug} title={c?.title ?? slug} query={`tag:${slug}`} />; }
