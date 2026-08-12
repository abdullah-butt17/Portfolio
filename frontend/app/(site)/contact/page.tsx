import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/layout/page-header'
import { Reveal } from '@/components/ui/reveal'
import { ContactForm } from '@/components/contact/contact-form'
import { getProfile } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Abdullah Butt about a project, role, or collaboration.',
}

export default async function ContactPage() {
  const profile = await getProfile()

  return (
    <>
      <PageHeader
        eyebrow="// get in touch"
        title="Let's build something together"
        description={
          profile.email
            ? `Have a project in mind or just want to say hello? Reach me directly at ${profile.email}, or send a message below.`
            : "Have a project in mind or just want to say hello? Send a message below."
        }
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <Reveal>
            <ContactForm />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
