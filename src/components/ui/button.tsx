import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva('inline-flex h-11 items-center justify-center gap-2 rounded-sm px-5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', { variants: { variant: { default: 'bg-primary text-primary-foreground hover:bg-primary/90', outline: 'border border-border bg-background text-foreground hover:bg-muted', ghost: 'text-foreground hover:bg-muted', accent: 'bg-accent text-accent-foreground hover:bg-accent/90' }, size: { default: 'h-11 px-5', sm: 'h-9 px-3 text-xs', icon: 'size-11 p-0', lg: 'h-13 px-8 text-base' } }, defaultVariants: { variant: 'default', size: 'default' } })

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean }
export function Button({ className, variant, size, asChild, ...props }: Props) { const Comp = asChild ? Slot : 'button'; return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} /> }
