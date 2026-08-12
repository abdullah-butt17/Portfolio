import { ArrowUpRight, Mail } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { getProfile } from '@/lib/api'

export async function CTA() {
  const profile = await getProfile()

  return (
    <section className="py-20 sm:py-28" aria-labelledby="cta-heading">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl border border-border-strong bg-surface/50 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
            <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
          </div>

          <p className="font-mono text-sm text-primary">Let&apos;s collaborate</p>
          <h2
            id="cta-heading"
            className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl"
          >
            Have a project in mind? Let&apos;s build something great together.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            I&apos;m currently available for freelance work and full-time roles.
            Whether it&apos;s a full-stack build or an AI-powered feature, I&apos;d
            love to hear about it.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" size="lg">
              Let&apos;s Work Together
              <ArrowUpRight />
            </Button>
            {profile.email && (
              <Button href={`mailto:${profile.email}`} size="lg" variant="outline">
                <Mail />
                {profile.email}
              </Button>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
