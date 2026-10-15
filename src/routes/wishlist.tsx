import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/store/product-card";
import { useWishlist } from "@/stores/wishlist";
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/wishlist")({ head: () => meta("المفضلة — Floukaa", "القطع اللي حفظتيها."), component: W });
function W() { const items = useWishlist(s => s.items); return <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6"><h1 className="mb-8 text-2xl font-black sm:text-3xl">المفضلة</h1>{items.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4">{items.map(p => <ProductCard key={p.id} product={p} />)}</div> : <p className="py-20 text-center text-muted-foreground">لسه مفيش حاجة في المفضلة. <Link to="/shop" className="font-bold text-accent">ابدئي التسوق</Link></p>}</div>; }
