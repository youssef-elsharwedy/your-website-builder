import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_OPTIONS, PRICE_OPTIONS, SORT_OPTIONS, type CatalogState, type SortKey } from "./use-catalog";

type Opt = { value: string; label: string };

/** Reusable dropdown built on the shared Select component. */
export function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly Opt[]; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange} dir="rtl">
      <SelectTrigger aria-label={label} className="h-11 w-full min-w-0 rounded-full bg-background sm:w-44">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

type Props = { state: CatalogState; update: (p: Partial<CatalogState>) => void; reset: () => void; activeCount: number; hideCategory?: boolean; hideSale?: boolean };

export function CatalogToolbar({ state, update, reset, activeCount, hideCategory, hideSale }: Props) {
  const [q, setQ] = useState(state.search);
  useEffect(() => setQ(state.search), [state.search]);
  // Debounced search so typing doesn't fire a request per key.
  useEffect(() => {
    if (q === state.search) return;
    const t = setTimeout(() => update({ search: q.trim() }), 400);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mb-8 rounded-3xl border border-border bg-card p-3 sm:p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحثي في المنتجات..." aria-label="بحث" className="h-11 rounded-full bg-background pr-10" />
          {q && (
            <button type="button" aria-label="مسح البحث" onClick={() => { setQ(""); update({ search: "" }); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <FilterSelect label="ترتيب" value={state.sort} options={SORT_OPTIONS} onChange={(v) => update({ sort: v as SortKey })} />
          {!hideCategory && <FilterSelect label="القسم" value={state.category} options={CATEGORY_OPTIONS} onChange={(v) => update({ category: v })} />}
          <FilterSelect label="السعر" value={state.price} options={PRICE_OPTIONS} onChange={(v) => update({ price: v })} />
          {!hideSale && (
            <div className="flex h-11 items-center justify-between gap-2 rounded-full border border-input bg-background px-4">
              <Label htmlFor="on-sale" className="text-sm">عروض فقط</Label>
              <Switch id="on-sale" checked={state.onSale} onCheckedChange={(v) => update({ onSale: v })} />
            </div>
          )}
        </div>
      </div>
      {activeCount > 0 && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="size-4 shrink-0" />
          <span>{activeCount} فلتر مفعّل</span>
          <Button variant="ghost" size="sm" onClick={() => { setQ(""); reset(); }}>مسح الكل</Button>
        </div>
      )}
    </div>
  );
}
