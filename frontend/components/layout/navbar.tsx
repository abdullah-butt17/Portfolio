'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navItems } from '@/lib/nav'
import { useScrolled } from '@/hooks/use-scrolled'
import { Logo } from './logo'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, Menu, X } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const scrolled = useScrolled(10)
  const [open, setOpen] = useState(false)

  // Close menu on route change.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'transition-all duration-300',
          scrolled
            ? 'border-b border-border bg-background/70 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8"
          aria-label="Primary"
        >
          <Logo />

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm transition-colors',
                    isActive(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Button href="/contact" size="sm" variant="outline">
              Let&apos;s Work Together
              <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </div>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-border-strong bg-surface/60 text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-0 top-16 z-40 origin-top border-b border-border bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-4 opacity-0',
        )}
      >
        <ul className="flex flex-col gap-1 px-5 py-6">
          {navItems.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center justify-between rounded-xl px-4 py-3.5 text-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-surface text-foreground'
                    : 'text-muted-foreground hover:bg-surface/60 hover:text-foreground',
                )}
                style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="size-1.5 rounded-full bg-primary" />
                )}
              </Link>
            </li>
          ))}
          <li className="mt-4 px-1">
            <Button href="/contact" size="lg" className="w-full">
              Let&apos;s Work Together
              <ArrowUpRight />
            </Button>
          </li>
        </ul>
      </div>
    </header>
  )
}
