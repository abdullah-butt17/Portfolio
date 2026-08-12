'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FolderKanban, User, Sparkles, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/lib/toast-context'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Profile', href: '/admin/profile', icon: User },
  { label: 'Skills', href: '/admin/skills', icon: Sparkles },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const toast = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    router.replace('/admin/login')
  }

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <Link href="/admin" className="font-mono text-base font-semibold">
          Admin<span className="text-primary">.</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              isActive(item.href)
                ? 'bg-surface-2 text-foreground'
                : 'text-muted-foreground hover:bg-surface hover:text-foreground',
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <p className="mb-2 truncate text-xs text-muted-foreground">{admin?.email}</p>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-destructive"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border md:block">{SidebarContent}</aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-background">{SidebarContent}</aside>
        </div>
      )}

      <div className="flex-1">
        <div className="flex h-16 items-center justify-between border-b border-border px-4 md:hidden">
          <span className="font-mono text-sm font-semibold">Admin</span>
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2" aria-label="Open menu">
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  )
}
