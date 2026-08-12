import type { ReactNode } from 'react'
import { Inbox, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-surface-2', className)} />
}

export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="text-muted-foreground">{icon ?? <Inbox className="size-7" />}</div>
      <p className="font-medium">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong.',
  description = 'Please try again.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 py-16 text-center">
      <AlertTriangle className="size-7 text-destructive" />
      <p className="font-medium">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50"
        >
          Try again
        </button>
      )}
    </div>
  )
}
