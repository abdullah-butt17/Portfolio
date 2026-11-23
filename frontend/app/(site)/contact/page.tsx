import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/layout/page-header'
import { Reveal } from '@/components/ui/reveal'
import { ContactForm } from '@/components/contact/contact-form'
import { getProfile } from '@/lib/api'


export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Abdullah Butt, a Full-Stack Developer and AI Engineer, for software development opportunities, freelance projects, technical collaborations, and professional inquiries.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Abdullah Butt',
    description:
      'Get in touch with Abdullah Butt about full-stack development, AI projects, software engineering opportunities, and collaborations.',
    url: '/contact',
    type: 'website',
    siteName: 'Abdullah Butt',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Abdullah Butt',
    description:
      'Connect with Abdullah Butt for software development projects, professional opportunities, and collaborations.',
  },
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
