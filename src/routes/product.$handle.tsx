import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Minus, Plus, Truck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/store/motion";
import { Button } from "@/components/ui/button";
import { formatCurrency, getProduct, type ShopifyProduct } from "@/lib/shopify";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "منتج — Floukaa" },
      { name: "description", content: "تفاصيل المنتج من فلوكة للإكسسوارات والهدايا." },
      { property: "og:title", content: "منتج — Floukaa" },
      { property: "og:description", content: "تفاصيل المنتج من فلوكة للإكسسوارات والهدايا." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [p, setP] = useState<ShopifyProduct | null | undefined>(undefined);
  const [img, setImg] = useState(0);
  const [vi, setVi] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.addItem);
  const busy = useCart((s) => s.busy);
  const wish = useWishlist();

  useEffect(() => {
    setP(undefined);
    void getProduct(handle).then(setP).catch(() => setP(null));
  }, [handle]);

  if (p === undefined)
    return <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 md:grid-cols-2"><div className="aspect-square animate-pulse rounded-3xl bg-muted" /><div className="h-64 animate-pulse rounded-3xl bg-muted" /></div>;
  if (!p)
    return <div className="py-24 text-center"><p className="text-muted-foreground">المنتج غير موجود.</p><Link to="/shop" className="mt-4 inline-block font-bold text-accent">رجوع للمتجر</Link></div>;

  const variants = p.variants.edges.map((e) => e.node);
  const v = variants[vi];
  const images = p.images.edges.map((e) => e.node);
  const liked = wish.items.some((i) => i.id === p.id);

  return (
    <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-6 sm:px-6 sm:py-10 md:grid-cols-2 md:gap-10 [&>*]:min-w-0">
      <Reveal>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
          <AnimatePresence mode="wait">
            {images[img] && <motion.img key={images[img].url} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} src={images[img].url} alt={images[img].altText ?? p.title} className="size-full object-cover" />}
          </AnimatePresence>
        </div>
        {images.length > 1 && (
          <div className="scroll-thin mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((im, i) => (
              <motion.button whileTap={{ scale: 0.92 }} key={im.url} onClick={() => setImg(i)} aria-label={`صورة ${i + 1}`} className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:size-20 ${i === img ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={im.url} alt="" className="size-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </Reveal>
      <Reveal delay={0.1} className="md:sticky md:top-32 md:self-start">
        <p className="text-xs font-bold text-accent">{p.productType || "إكسسوارات"}</p>
        <h1 className="mt-2 break-words text-2xl font-black sm:text-3xl">{p.title}</h1>
        <p className="mt-3 text-xl font-extrabold sm:mt-4 sm:text-2xl">{v ? formatCurrency(v.price) : formatCurrency(p.priceRange.minVariantPrice)}</p>
        {variants.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {variants.map((x, i) => (
              <Button key={x.id} variant={i === vi ? "default" : "outline"} size="sm" className="max-w-full truncate" onClick={() => setVi(i)}>{x.title}</Button>
            ))}
          </div>
        )}
        <div className="mt-8 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2 sm:gap-3">
          <div className="flex items-center rounded-full border border-border">
            <Button size="icon" variant="ghost" onClick={() => setQty(qty + 1)} aria-label="زيادة"><Plus className="size-4" /></Button>
            <motion.span key={qty} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="w-6 text-center font-bold sm:w-8">{qty}</motion.span>
            <Button size="icon" variant="ghost" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="تقليل"><Minus className="size-4" /></Button>
          </div>
          <motion.div whileTap={{ scale: 0.97 }} className="min-w-0">
            <Button variant="accent" className="w-full" disabled={!v || busy || !v.availableForSale}
              onClick={() => v && add({ product: p, variantId: v.id, variantTitle: v.title, price: v.price, quantity: qty, selectedOptions: v.selectedOptions })}>
              <span className="truncate">{v?.availableForSale === false ? "غير متوفر" : "أضيفي للسلة"}</span>
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.85 }}>
            <Button size="icon" variant="outline" onClick={() => wish.toggle(p)} aria-label="المفضلة">
              <Heart className={liked ? "size-5 fill-accent text-accent" : "size-5"} />
            </Button>
          </motion.div>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Truck className="size-4 shrink-0" /> شحن لجميع محافظات مصر</p>
        {p.description && <p className="mt-8 break-words leading-8 text-muted-foreground">{p.description}</p>}
      </Reveal>
    </div>
  );
}
