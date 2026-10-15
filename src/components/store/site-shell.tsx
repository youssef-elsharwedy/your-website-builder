import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import { Heart, Menu, Minus, Plus, Search, ShoppingBag, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { formatCurrency } from '@/lib/shopify'
import { useCart } from '@/stores/cart'
import { ThemeToggle } from './theme-toggle'
import { PageFade } from './motion'

const nav: ReadonlyArray<readonly [string, string]> = [['مساعدة التسوق', '/assistant'], ['خصومات حتى 50%', '/offers'], ['سلاسل', '/category/necklaces'], ['أساور', '/category/bracelets'], ['حلقان', '/category/earrings'], ['خلخال', '/category/anklets'], ['خواتم', '/category/rings'], ['أطفال', '/category/kids'], ['كل المنتجات', '/shop']]

export function SiteShell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false), [searchOpen, setSearchOpen] = useState(false)
  const r = useRouter(), path = useRouterState({ select: s => s.location.pathname })
  const items = useCart(s => s.items), open = useCart(s => s.drawerOpen), setOpen = useCart(s => s.setDrawerOpen), sync = useCart(s => s.syncCart)
  const count = items.reduce((a, b) => a + b.quantity, 0)
  useEffect(() => { void sync(); const vis = () => document.visibilityState === 'visible' && void sync(); document.addEventListener('visibilitychange', vis); return () => document.removeEventListener('visibilitychange', vis) }, [sync])
  useEffect(() => { setSearchOpen(false); setMenu(false) }, [path])
  const onSearch = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const q = new FormData(e.currentTarget).get('q'); void r.navigate({ to: '/search', search: { q: String(q ?? '') } }) }
  const searchForm = (cls: string) => (
    <form onSubmit={onSearch} className={`items-center rounded-full border border-border bg-card p-1 ${cls}`}>
      <input name="q" className="h-10 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" placeholder="إنتِ بتدوري على إيه؟" />
      <Button size="icon" className="shrink-0 rounded-full" aria-label="بحث"><Search className="size-4" /></Button>
    </form>
  )
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background">
      <div className="overflow-hidden bg-primary py-2 text-primary-foreground">
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="px-4 text-center text-[11px] font-bold sm:text-xs">شحن لجميع محافظات مصر — اطلبِ دلوقتي واستمتعي بأحدث الإكسسوارات</motion.p>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 sm:h-17 sm:gap-3 sm:px-6 md:flex">
          <div className="flex min-w-0 items-center gap-1">
            <Button className="shrink-0 lg:hidden" size="icon" variant="ghost" onClick={() => setMenu(true)} aria-label="القائمة"><Menu /></Button>
            <Link to="/" className="min-w-0 shrink-0 leading-none">
              <span className="block text-xl font-black sm:text-2xl">FLOUKAA</span>
              <span className="mt-1 block truncate text-[9px] font-bold text-accent">فلوكة للإكسسوارات والهدايا</span>
            </Link>
          </div>
          {searchForm('mx-auto hidden w-full max-w-xl md:flex')}
          <div className="col-start-3 flex shrink-0 items-center justify-end md:ms-auto">
            <Button size="icon" variant="ghost" className="md:hidden" aria-label="بحث" onClick={() => setSearchOpen(v => !v)}><Search /></Button>
            <ThemeToggle />
            <Button asChild size="icon" variant="ghost" aria-label="المفضلة"><Link to="/wishlist"><Heart /></Link></Button>
            <Button size="icon" variant="ghost" className="relative" onClick={() => setOpen(true)} aria-label="السلة">
              <ShoppingBag />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="absolute end-0 top-0 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{count}</motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border md:hidden">
              <div className="p-3">{searchForm('flex')}</div>
            </motion.div>
          )}
        </AnimatePresence>
        <nav className="hidden border-t border-border lg:block">
          <div className="scroll-hidden mx-auto flex h-12 max-w-[1400px] items-center justify-center gap-1 overflow-x-auto px-6">
            {nav.map(([l, to]) => {
              const active = path === to
              return (
                <a key={to} href={to} className={`relative shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold transition-colors hover:text-accent ${active ? 'text-accent' : ''}`}>
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-muted" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                  {l}
                </a>
              )
            })}
          </div>
        </nav>
      </header>
      <main className="flex-1"><PageFade id={path}>{children}</PageFade></main>
      <Footer />
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="right" className="w-[85vw] max-w-sm gap-0 p-0">
          <div className="border-b border-border px-6 py-5"><SheetTitle className="text-2xl font-black">FLOUKAA</SheetTitle><p className="text-xs font-bold text-accent">فلوكة للإكسسوارات والهدايا</p></div>
          <nav className="scroll-thin grid flex-1 content-start gap-1 overflow-y-auto p-3">
            {nav.map(([l, to], i) => (
              <motion.a key={to} href={to} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }} onClick={() => setMenu(false)} className={`rounded-2xl px-4 py-3 text-sm font-bold transition-colors hover:bg-muted hover:text-accent ${path === to ? 'bg-muted text-accent' : ''}`}>{l}</motion.a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <CartDrawer open={open} setOpen={setOpen} />
    </div>
  )
}

function CartDrawer({ open, setOpen }: { open: boolean; setOpen(v: boolean): void }) {
  const items = useCart(s => s.items), busy = useCart(s => s.busy), update = useCart(s => s.updateQuantity), remove = useCart(s => s.removeItem), url = useCart(s => s.checkoutUrl)
  const total = items.reduce((a, b) => a + Number(b.price.amount) * b.quantity, 0)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-full gap-0 p-0 sm:max-w-md">
        <div className="border-b border-border px-6 py-5"><SheetTitle className="text-xl font-black">سلة التسوق</SheetTitle></div>
        <div className="scroll-thin flex-1 overflow-y-auto px-3 py-3 sm:px-4">
          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid h-full place-items-center text-center text-muted-foreground">
              <div>
                <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }} className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-muted"><ShoppingBag className="size-9" /></motion.span>
                <p className="font-bold">سلتك لسه فاضية</p>
              </div>
            </motion.div>
          ) : (
            <motion.div layout className="grid gap-3">
              <AnimatePresence initial={false}>
                {items.map(i => (
                  <motion.div layout key={i.variantId} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60, height: 0 }} className="flex gap-3 rounded-2xl border border-border bg-card p-2.5 sm:p-3">
                    <img src={i.product.images.edges[0]?.node.url} alt="" className="size-16 shrink-0 rounded-xl bg-muted object-cover sm:size-20" />
                    <div className="min-w-0 flex-1">
                      <b className="line-clamp-2 text-sm">{i.product.title}</b>
                      <p className="my-1 truncate text-xs text-muted-foreground">{i.variantTitle !== 'Default Title' ? i.variantTitle : ''}</p>
                      <div className="flex items-center justify-between gap-2">
                        <b className="truncate text-sm">{formatCurrency(i.price)}</b>
                        <div className="flex shrink-0 items-center rounded-full border border-border">
                          <Button size="icon" variant="ghost" className="size-8" aria-label="تقليل" onClick={() => i.quantity === 1 ? remove(i.variantId) : update(i.variantId, i.quantity - 1)}>{i.quantity === 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3" />}</Button>
                          <motion.span key={i.quantity} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="w-6 text-center text-sm font-bold">{i.quantity}</motion.span>
                          <Button size="icon" variant="ghost" className="size-8" aria-label="زيادة" onClick={() => update(i.variantId, i.quantity + 1)}><Plus className="size-3" /></Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
            <div className="mb-4 flex justify-between text-lg font-black"><span>الإجمالي</span><span>{new Intl.NumberFormat('ar-EG', { style: 'currency', currency: items[0]?.price.currencyCode ?? 'EGP', maximumFractionDigits: 0 }).format(total)}</span></div>
            <Button className="w-full" size="lg" disabled={busy || !url} onClick={() => url && window.open(url, '_blank')}>إتمام الطلب بأمان</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Footer() {
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-5 py-12 sm:px-6 md:grid-cols-4 md:gap-10 md:py-14 [&>*]:min-w-0">
        <div className="col-span-2 md:col-span-1"><h3 className="text-2xl font-black">FLOUKAA</h3><p className="mt-4 max-w-xs text-sm opacity-75">إكسسوارات وهدايا مختارة بذوق، من بورسعيد لكل مصر.</p></div>
        <div><h4 className="font-black">تسوقي</h4><div className="mt-4 grid gap-2 text-sm opacity-75"><Link to="/shop" className="hover:opacity-100">كل المنتجات</Link><Link to="/new-arrivals">وصل حديثًا</Link><Link to="/best-sellers">الأكثر مبيعًا</Link></div></div>
        <div><h4 className="font-black">خدمة العملاء</h4><div className="mt-4 grid gap-2 text-sm opacity-75"><Link to="/contact">تواصل معنا</Link><Link to="/faq">الأسئلة الشائعة</Link><Link to="/returns">الاستبدال والاسترجاع</Link></div></div>
        <div className="col-span-2 md:col-span-1"><h4 className="font-black">خليكي أول واحدة تعرف</h4><form onSubmit={e => e.preventDefault()} className="mt-4 flex gap-1 rounded-full bg-background p-1"><input type="email" className="h-10 min-w-0 flex-1 rounded-full bg-transparent px-4 text-sm text-foreground outline-none" placeholder="بريدك الإلكتروني" /><Button variant="accent" className="shrink-0 rounded-full">اشتراك</Button></form></div>
      </div>
      <div className="border-t border-primary-foreground/15 px-6 py-5 text-center text-xs opacity-60">© 2026 Floukaa. جميع الحقوق محفوظة.</div>
    </footer>
  )
}
