import { cn } from '@/lib/utils'

const c = {
  kw: 'text-primary',
  fn: 'text-accent',
  str: 'text-emerald-400/90',
  key: 'text-foreground',
  mut: 'text-muted-foreground',
}

function Line({
  n,
  indent = 0,
  children,
}: {
  n: number
  indent?: number
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <span className="w-5 shrink-0 select-none text-right text-muted-foreground/40">
        {n}
      </span>
      <span style={{ paddingLeft: indent * 14 }} className="text-foreground/90">
        {children}
      </span>
    </div>
  )
}

export function CodePanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border-strong bg-surface/70 shadow-2xl backdrop-blur-sm',
        className,
      )}
      aria-hidden
    >
      {/* Window bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-3 rounded-full bg-destructive/70" />
        <span className="size-3 rounded-full bg-amber-400/70" />
        <span className="size-3 rounded-full bg-emerald-400/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">
          developer.ts
        </span>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6 sm:text-[13px]">
        <code className="block">
          <Line n={1}>
            <span className={c.kw}>const</span>{' '}
            <span className={c.key}>engineer</span> <span className={c.mut}>=</span>{' '}
            <span className={c.mut}>{'{'}</span>
          </Line>
          <Line n={2} indent={1}>
            <span className={c.key}>name</span>
            <span className={c.mut}>:</span>{' '}
            <span className={c.str}>&apos;Abdullah Butt&apos;</span>
            <span className={c.mut}>,</span>
          </Line>
          <Line n={3} indent={1}>
            <span className={c.key}>role</span>
            <span className={c.mut}>:</span>{' '}
            <span className={c.str}>&apos;Full-Stack & AI&apos;</span>
            <span className={c.mut}>,</span>
          </Line>
          <Line n={4} indent={1}>
            <span className={c.key}>stack</span>
            <span className={c.mut}>:</span>{' '}
            <span className={c.mut}>[</span>
            <span className={c.str}>&apos;React&apos;</span>
            <span className={c.mut}>, </span>
            <span className={c.str}>&apos;Node&apos;</span>
            <span className={c.mut}>, </span>
            <span className={c.str}>&apos;Mongo&apos;</span>
            <span className={c.mut}>],</span>
          </Line>
          <Line n={5} indent={1}>
            <span className={c.fn}>build</span>
            <span className={c.mut}>(</span>
            <span className={c.key}>idea</span>
            <span className={c.mut}>)</span> <span className={c.mut}>{'{'}</span>
          </Line>
          <Line n={6} indent={2}>
            <span className={c.kw}>return</span>{' '}
            <span className={c.key}>idea</span>
            <span className={c.mut}>.</span>
            <span className={c.fn}>ship</span>
            <span className={c.mut}>(</span>
            <span className={c.str}>&apos;production&apos;</span>
            <span className={c.mut}>)</span>
          </Line>
          <Line n={7} indent={1}>
            <span className={c.mut}>{'}'}</span>
          </Line>
          <Line n={8}>
            <span className={c.mut}>{'}'}</span>
            <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-primary/80" />
          </Line>
        </code>
      </pre>

      <div className="absolute -right-16 -top-16 size-40 rounded-full bg-primary/20 blur-3xl" />
    </div>
  )
}
