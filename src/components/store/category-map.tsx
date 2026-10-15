import { Link } from "@tanstack/react-router";
import { CATEGORY_TREE, childrenOf, type CatNode } from "@/lib/category-tree";

// Top-level order follows floukaa.com's category map (right-to-left columns).
const COLUMNS: number[][] = [
  [328, 661, 334, 322],
  [579, 333, 335, 578],
  [337, 207, 209],
  [255, 208, 302, 309, 262],
  [271, 293, 15],
  [212, 308, 210],
];

function Leaf({ c }: { c: CatNode }) {
  return (
    <li className="relative flex items-center gap-2 py-2 ps-4">
      <span className="absolute start-0 top-1/2 h-px w-3 bg-border" />
      <span className="size-2 shrink-0 rounded-full bg-muted-foreground/50" />
      <Link to="/category/$slug" params={{ slug: `c${c.id}` }} className="text-sm text-muted-foreground hover:text-accent">{c.name}</Link>
    </li>
  );
}

function Branch({ c }: { c: CatNode }) {
  const kids = childrenOf(c.id);
  return (
    <li className="relative py-2">
      <div className="flex items-center gap-2">
        <span className="size-3 shrink-0 rounded-full bg-foreground/70 ring-4 ring-background" />
        <Link to="/category/$slug" params={{ slug: `c${c.id}` }} className="font-bold hover:text-accent">{c.name}</Link>
        <span className="text-xs text-muted-foreground">({c.count})</span>
      </div>
      {kids.length > 0 && <ul className="ms-1.5 border-s border-border ps-2">{kids.map((k) => <Leaf key={k.id} c={k} />)}</ul>}
    </li>
  );
}

export function CategoryMap() {
  const used = new Set(COLUMNS.flat());
  const extra = CATEGORY_TREE.filter((c) => c.parent === 0 && !used.has(c.id)).map((c) => c.id);
  const cols = extra.length ? [...COLUMNS, extra] : COLUMNS;
  return (
    <div className="grid gap-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cols.map((col, i) => (
        <ul key={i} className="border-s border-border ps-3">
          {col.map((id) => { const c = CATEGORY_TREE.find((x) => x.id === id); return c ? <Branch key={id} c={c} /> : null; })}
        </ul>
      ))}
    </div>
  );
}
