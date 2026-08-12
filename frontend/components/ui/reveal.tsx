'use client'

import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/use-reveal'
import type { ElementType, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger delay in ms. */
  delay?: number
  as?: ElementType
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const { ref, visible } = useReveal()
  return (
    <Tag
      ref={ref}
      className={cn('reveal', visible && 'is-visible', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
