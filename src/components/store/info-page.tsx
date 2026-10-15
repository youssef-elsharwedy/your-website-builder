import { Reveal } from './motion'

export function InfoPage({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Reveal><p className="text-xs font-bold text-accent">FLOUKAA</p><h1 className="mt-2 text-2xl font-black sm:text-4xl">{title}</h1></Reveal>
      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card px-4 sm:mt-10 sm:px-6">
        {items.map(([q, a], i) => <Reveal key={q} delay={i * 0.06} y={12} className="py-5 sm:py-6"><h2 className="font-black">{q}</h2><p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">{a}</p></Reveal>)}
      </div>
    </div>
  )
}
