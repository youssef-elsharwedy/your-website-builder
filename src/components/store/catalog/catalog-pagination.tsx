import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

function pages(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  sorted.forEach((n, i) => { if (i && n - (sorted[i - 1] as number) > 1) out.push("…"); out.push(n); });
  return out;
}

/** Reusable numbered pagination (RTL: "previous" points right). */
export function CatalogPagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const go = (p: number) => { onChange(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <Pagination className="mt-12">
      <PaginationContent className="flex-wrap justify-center">
        <PaginationItem>
          <Button variant="outline" size="icon" className="rounded-full" aria-label="الصفحة السابقة" disabled={page <= 1} onClick={() => go(page - 1)}><ChevronRight className="size-4" /></Button>
        </PaginationItem>
        {pages(page, totalPages).map((n, i) => (
          <PaginationItem key={`${n}-${i}`}>
            {n === "…" ? <PaginationEllipsis /> : (
              <Button variant={n === page ? "default" : "ghost"} size="icon" className="rounded-full" aria-current={n === page ? "page" : undefined} onClick={() => go(n)}>{n}</Button>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button variant="outline" size="icon" className="rounded-full" aria-label="الصفحة التالية" disabled={page >= totalPages} onClick={() => go(page + 1)}><ChevronLeft className="size-4" /></Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
