import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/store/catalog-page";
import { CATEGORIES } from "@/lib/categories";
import { catById } from "@/lib/category-tree";
const titleOf = (slug: string) => CATEGORIES.find(c => c.slug === slug)?.title ?? (/^c\d+$/.test(slug) ? catById(Number(slug.slice(1)))?.name : undefined);
export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => { const t = titleOf(params.slug) ?? "تشكيلة"; return { meta: [{ title: `${t} — Floukaa` }, { name: "description", content: `تسوقي ${t} من فلوكة.` }, { property: "og:title", content: `${t} — Floukaa` }, { property: "og:description", content: `تسوقي ${t} من فلوكة.` }] }; },
  component: Cat,
});
function Cat() { const { slug } = Route.useParams(); return <CatalogPage key={slug} title={titleOf(slug) ?? slug} query={`tag:${slug}`} />; }
