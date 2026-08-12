import Link from 'next/link'
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { navItems } from '@/lib/nav'
import { getProfile } from '@/lib/api'

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
} as const

export async function Footer() {
  const profile = await getProfile()

  return (
    <footer className="relative mt-24 border-t border-border">
      <Container className="py-14">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-semibold tracking-tight">
              {profile.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {profile.title}. Building modern web applications, business
              systems, and intelligent software.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {profile.socials.map((s) => {
                const Icon = socialIcons[s.icon]
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.icon === 'mail' ? undefined : '_blank'}
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid size-10 place-items-center rounded-full border border-border bg-surface/50 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground"
                  >
                    <Icon className="size-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Navigate
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Get in touch
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {profile.email && (
                  <li>
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Email me <ArrowUpRight className="size-3.5" />
                    </a>
                  </li>
                )}
                <li>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contact form <ArrowUpRight className="size-3.5" />
                  </Link>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">
                    {profile.availability}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {profile.name}. All rights
            reserved.
          </p>
          <p>Designed & built with care.</p>
        </div>
      </Container>
    </footer>
  )
}
