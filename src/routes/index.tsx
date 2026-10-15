import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gift, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import { getProducts, type ShopifyProduct } from "@/lib/shopify";
import { CATEGORIES } from "@/lib/categories";
import { meta } from "@/lib/seo";
import hero from "@/assets/hero.jpg";
import { motion } from "motion/react";
import { Reveal, Stagger, StaggerItem } from "@/components/store/motion";

export const Route = createFileRoute("/")({
  head: () => meta("Floukaa — فلوكة للإكسسوارات والهدايا", "سلاسل، أساور، حلقان وخلاخيل بتصميمات جديدة. شحن لجميع محافظات مصر."),
  component: Index,
});

const tabs = [["وصل حديثًا", "tag:new"], ["الأكثر مبيعًا", "tag:best"], ["متميز", "tag:featured"], ["عروض", "tag:sale"]] as const;

function Index() {
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);
  useEffect(() => {
    setProducts(null);
    void getProducts(10, tabs[tab]?.[1] || undefined).then(setProducts).catch(() => setProducts([]));
  }, [tab]);

  return (
    <>
      <section className="relative mx-3 mt-3 max-w-[1400px] overflow-hidden rounded-3xl sm:mx-6 sm:mt-4 xl:mx-auto">
        <motion.img initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} src={hero} alt="إكسسوارات فلوكة" width={1920} height={1088} className="h-[62svh] min-h-[380px] w-full object-cover sm:h-[70vh] sm:min-h-[460px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent sm:bg-gradient-to-l sm:from-background/85 sm:via-background/40" />
        <div className="absolute inset-0 flex items-end sm:items-center">
          <div className="mx-auto w-full max-w-[1400px] px-5 pb-8 sm:px-10 sm:pb-0">
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }} className="max-w-md">
              {[
                <p key="a" className="text-[10px] font-bold tracking-[0.3em] text-accent sm:text-xs">NEW EXCLUSIVE COLLECTION</p>,
                <h1 key="b" className="mt-3 text-3xl font-black leading-tight sm:mt-4 sm:text-6xl">تشكيلة صيفية جديدة</h1>,
                <p key="c" className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">تصميمات حصرية مستوحاة من البحر، مختارة بذوق لكل مناسبة.</p>,
                <Button key="d" asChild size="lg" className="mt-6 sm:mt-8"><Link to="/shop">تسوقي الآن</Link></Button>,
              ].map((el, i) => (
                <motion.div key={i} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}>{el}</motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
        <Reveal className="mb-8 text-center">
          <p className="text-xs font-bold text-accent">تشكيلات جديدة صيفية</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">تسوقي حسب القسم</h2>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {CATEGORIES.filter((c) => c.img).map((c) => (
            <StaggerItem key={c.slug}>
              <Link to="/category/$slug" params={{ slug: c.slug }} className="group block">
                <motion.div whileHover={{ y: -6 }} className="aspect-square overflow-hidden rounded-3xl bg-muted shadow-soft">
                  <img src={c.img} alt={c.title} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-110" />
                </motion.div>
                <p className="mt-3 text-center text-base font-black transition-colors group-hover:text-accent sm:text-lg">{c.title}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <Reveal className="mb-8 flex justify-center">
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-card p-1">
            {tabs.map(([l], i) => (
              <button key={l} onClick={() => setTab(i)} className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors ${i === tab ? "text-primary-foreground" : "hover:text-accent"}`}>
                {i === tab && <motion.span layoutId="home-tab" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>
        </Reveal>
        {products === null ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 5 }, (_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />)}</div>
        ) : (
          <Stagger key={tab} className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-5">{products.map((p) => <StaggerItem key={p.id}><ProductCard product={p} /></StaggerItem>)}</Stagger>
        )}
        <Reveal className="mt-10 text-center"><Button asChild variant="outline"><Link to="/shop">عرض كل المنتجات</Link></Button></Reveal>
      </section>

      <Stagger className="mx-auto mt-16 grid max-w-[1400px] gap-4 px-4 sm:mt-20 sm:grid-cols-3 sm:gap-6 sm:px-6">
        {[[Truck, "شحن لكل مصر", "توصيل لجميع المحافظات"], [Gift, "تغليف هدايا", "جاهزة تتهادى على طول"], [ShieldCheck, "استبدال سهل", "خلال 14 يوم من الاستلام"]].map(([I, t, d]) => {
          const Icon = I as typeof Truck;
          return (
            <StaggerItem key={t as string}>
              <motion.div whileHover={{ y: -4 }} className="flex h-full min-w-0 items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <Icon className="size-8 shrink-0 text-accent" />
                <div className="min-w-0"><p className="font-black">{t as string}</p><p className="text-sm text-muted-foreground">{d as string}</p></div>
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </>
  );
}
