import Image from 'next/image'
import { ArrowRight, ArrowUpRight, Download, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { CodePanel } from './code-panel'
import { getProfile } from '@/lib/api'

export async function Hero() {
  const profile = await getProfile()

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[350px] w-[350px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Content */}
          <div className="flex flex-col items-start">
            <div
              className="fade-up inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur"
              style={{ animationDelay: '0ms' }}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>

              {profile.availability}
            </div>

            <p
              className="fade-up mt-8 font-mono text-sm tracking-wide text-primary"
              style={{ animationDelay: '80ms' }}
            >
              {profile.name}
            </p>

            <h1
              className="fade-up mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]"
              style={{ animationDelay: '160ms' }}
            >
              Building Digital
              <br />
              Solutions That{' '}
              <span className="text-gradient">Matter.</span>
            </h1>

            <p
              className="fade-up mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
              style={{ animationDelay: '240ms' }}
            >
              I build modern web applications, business systems, and
              intelligent software solutions with a focus on performance,
              usability, and real-world impact.
            </p>

            <div
              className="fade-up mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: '320ms' }}
            >
              <Button href="/projects" size="lg">
                View My Work
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>

              <Button href="/contact" size="lg" variant="outline">
                Let&apos;s Talk
                <ArrowUpRight />
              </Button>

              {profile.resumeUrl && (
                <Button
                  href={profile.resumeUrl}
                  size="lg"
                  variant="ghost"
                  className="text-muted-foreground"
                >
                  <Download />
                  Resume
                </Button>
              )}
            </div>

            <dl
              className="fade-up mt-12 grid w-full max-w-md grid-cols-3 gap-4 border-t border-border pt-8"
              style={{ animationDelay: '400ms' }}
            >
              {[
                { v: 'Full-Stack', l: 'MERN Development' },
                { v: 'AI / ML', l: 'Intelligent Systems' },
                { v: 'Real-World', l: 'Business Software' },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="text-sm font-semibold text-foreground">
                    {s.v}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual */}
          <div
            className="fade-up relative hidden lg:block"
            style={{ animationDelay: '360ms' }}
          >
            <div className="relative mx-auto max-w-xl">
              {/* Main Code Panel */}
              <div className="animate-float">
                <CodePanel />
              </div>

              {/* Profile image */}
              {profile.profileImageUrl && (
                <div className="absolute -left-8 -top-8 z-20">
                  <div className="relative">
                    {/* Accent glow */}
                    <div className="absolute -inset-2 rounded-full bg-accent/20 blur-xl" />

                    {/* Image ring */}
                    <div className="relative size-28 overflow-hidden rounded-full border-4 border-background bg-surface shadow-2xl ring-1 ring-border-strong">
                      <Image
                        src={profile.profileImageUrl}
                        alt={`${profile.name} profile`}
                        fill
                        priority
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>

                    {/* Small status indicator */}
                    <span className="absolute bottom-1 right-1 flex size-6 items-center justify-center rounded-full border-4 border-background bg-accent">
                      <span className="size-2 rounded-full bg-background" />
                    </span>
                  </div>
                </div>
              )}

              {/* Developer badge */}
              <div className="absolute -right-5 -top-5 z-20 hidden rounded-xl border border-border-strong bg-background/90 px-4 py-3 shadow-xl backdrop-blur sm:block">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Full-Stack Developer
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      MERN · AI · Systems
                    </p>
                  </div>
                </div>
              </div>

              {/* Terminal status card */}
              <div className="absolute -bottom-6 -left-6 z-20 rounded-xl border border-border-strong bg-background/90 px-4 py-3 shadow-xl backdrop-blur">
                <p className="font-mono text-xs text-muted-foreground">
                  <span className="text-accent">$</span> npm run build
                </p>

                <p className="mt-1 text-xs text-emerald-400/90">
                  ✓ compiled successfully
                </p>
              </div>
            </div>
          </div>

          {/* Mobile profile image */}
          {profile.profileImageUrl && (
            <div
              className="fade-up order-first flex justify-center lg:hidden"
              style={{ animationDelay: '100ms' }}
            >
              <div className="relative">
                <div className="absolute -inset-3 rounded-full bg-accent/10 blur-2xl" />

                <div className="relative size-32 overflow-hidden rounded-full border-4 border-background bg-surface shadow-2xl ring-1 ring-border-strong sm:size-36">
                  <Image
                    src={profile.profileImageUrl}
                    alt={`${profile.name} profile`}
                    fill
                    priority
                    sizes="144px"
                    className="object-cover"
                  />
                </div>

                <span className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full border-4 border-background bg-accent">
                  <span className="size-2.5 rounded-full bg-background" />
                </span>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}