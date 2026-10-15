import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { meta } from "@/lib/seo";
import { recommendProducts, type RecommendResult } from "@/lib/recommend.functions";
import { ProductCard } from "@/components/store/product-card";
import { Reveal, Stagger, StaggerItem } from "@/components/store/motion";

export const Route = createFileRoute("/assistant")({
  head: () => meta("مساعدة التسوق الذكية — Floukaa", "اوصفي اللي بتدوري عليه وهنقترح لك أنسب القطع من فلوكة."),
  component: AssistantPage,
});

const examples = ["هدية لصاحبتي في عيد ميلادها بأقل من ٥٠٠ جنيه", "سلسلة رقيقة ذهبي للخروج", "حاجة لطيفة لبنت صغيرة"];

function AssistantPage() {
  const recommend = useServerFn(recommendProducts);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendResult | null>(null);

  async function run(text: string) {
    if (text.trim().length < 2 || loading) return;
    setLoading(true); setResult(null);
    try { setResult(await recommend({ data: { request: text } })); }
    catch { setResult({ intro: "", items: [], error: "حصل خطأ، جرّبي مرة أخرى." }); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold text-accent"><Sparkles className="size-4" /> FLOUKAA AI</p>
        <h1 className="mt-2 text-2xl font-black sm:text-4xl">قولي لنا بتدوري على إيه</h1>
        <p className="mt-2 text-sm text-muted-foreground">اوصفي المناسبة أو الستايل أو الميزانية، وهنختار لك أنسب القطع.</p>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); void run(q); }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={500} placeholder="مثلاً: هدية رقيقة لماما..." aria-label="وصف طلبك"
            className="h-12 min-w-0 flex-1 rounded-full border border-border bg-background px-5 text-sm" />
          <button type="submit" disabled={loading} className="h-12 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition active:scale-95 disabled:opacity-60">
            {loading ? "جاري الاختيار..." : "اقترحي لي"}
          </button>
        </form>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {examples.map((e) => <button key={e} type="button" onClick={() => { setQ(e); void run(e); }} className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">{e}</button>)}
        </div>
      </Reveal>

      <div className="mt-10">
        {loading && <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />)}</div>}
        {result?.error && <p className="text-center text-destructive">{result.error}</p>}
        {result && !result.error && (
          <>
            {result.intro && <Reveal className="mb-6 text-center font-bold">{result.intro}</Reveal>}
            {result.items.length > 0 && (
              <Stagger className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
                {result.items.map((it) => (
                  <StaggerItem key={it.product.id}>
                    <ProductCard product={it.product} />
                    <p className="mt-2 text-xs text-muted-foreground">{it.reason}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </>
        )}
      </div>
    </div>
  );
}
