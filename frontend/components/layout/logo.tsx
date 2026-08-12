import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/70',
        className,
      )}
      aria-label="Abdullah Butt — home"
    >
      <span className="relative grid size-9 place-items-center rounded-xl border border-border-strong bg-surface text-sm font-semibold tracking-tight">
        <span className="text-gradient">AB</span>
        <span className="absolute inset-0 rounded-xl ring-1 ring-primary/0 transition-all duration-300 group-hover:ring-primary/40" />
      </span>
      <span className="hidden text-sm font-semibold tracking-tight sm:block">
        Abdullah Butt
      </span>
    </Link>
  )
}
