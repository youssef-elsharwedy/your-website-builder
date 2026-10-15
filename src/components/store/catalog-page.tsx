import { ProductCard } from './product-card'
import { Reveal, Stagger, StaggerItem } from './motion'
import { CatalogToolbar } from './catalog/catalog-toolbar'
import { CatalogPagination } from './catalog/catalog-pagination'
import { PER_PAGE, useCatalog } from './catalog/use-catalog'

/** Single listing page used by shop, categories, offers, new arrivals, best sellers and search. */
export function CatalogPage({ title = 'كل المنتجات', query, search }: { title?: string; query?: string; search?: string }) {
  const cat = query?.startsWith('tag:') && !['tag:new', 'tag:best', 'tag:sale', 'tag:featured'].includes(query) ? query.slice(4) : undefined
  const base = cat ? undefined : query
  const c = useCatalog(base, { ...(cat ? { category: cat } : {}), ...(search ? { search } : {}) })
  const from = (c.state.page - 1) * PER_PAGE + 1, to = Math.min(c.state.page * PER_PAGE, c.total)

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
      <Reveal className="mb-6 min-w-0">
        <p className="text-xs font-bold text-accent">FLOUKAA COLLECTION</p>
        <h1 className="mt-2 break-words text-2xl font-black sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {c.loading ? 'جاري التحميل...' : c.total ? `عرض ${from}–${to} من ${c.total.toLocaleString('en-US')} منتج` : 'لا توجد نتائج'}
        </p>
      </Reveal>
      <CatalogToolbar state={c.state} update={c.update} reset={c.reset} activeCount={c.activeCount} hideCategory={!!cat} hideSale={query === 'tag:sale'} />
      {c.loading
        ? <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{Array.from({ length: 10 }, (_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />)}</div>
        : c.products.length
          ? <Stagger key={JSON.stringify(c.state)} className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">{c.products.map(x => <StaggerItem key={x.id}><ProductCard product={x} /></StaggerItem>)}</Stagger>
          : <Reveal className="py-20 text-center text-muted-foreground">لا توجد منتجات مطابقة.</Reveal>}
      <CatalogPagination page={c.state.page} totalPages={c.totalPages} onChange={(p) => c.update({ page: p })} />
    </div>
  )
}
