'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContactPayload } from '@/lib/types'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || ''

const initialForm: ContactPayload = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

const fieldClasses =
  'w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/60'

export function ContactForm() {
  const [form, setForm] = useState<ContactPayload>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const validate = () => {
    const next: Record<string, string> = {}

    if (!form.name.trim()) {
      next.name = 'Name is required'
    }

    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email'
    }

    if (!form.message.trim()) {
      next.message = 'Message is required'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setServerError('')

    if (!validate()) return

    if (!WEB3FORMS_ACCESS_KEY) {
      setServerError(
        'Contact form is not configured correctly. Please try again later.'
      )
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,

          name: form.name,
          email: form.email,
          subject: form.subject || 'Portfolio Contact',
          message: form.message,

          from_name: 'Portfolio Contact Form',
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsSuccess(true)
        setForm(initialForm)
        setErrors({})
      } else {
        setServerError(
          data?.message ||
            'Unable to send your message. Please try again.'
        )
      }
    } catch {
      setServerError(
        'Unable to send your message right now. Please try again later.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 py-14 text-center">
        <CheckCircle2 className="size-8 text-primary" />

        <p className="text-lg font-medium">
          Message sent successfully.
        </p>

        <p className="max-w-sm text-sm text-muted-foreground">
          I&apos;ll get back to you as soon as possible.
        </p>

        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setIsSuccess(false)}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            className={fieldClasses}
            placeholder="Your name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {errors.name && (
            <p className="mt-1.5 text-sm text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            className={fieldClasses}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {errors.email && (
            <p className="mt-1.5 text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="mb-1.5 block text-sm font-medium"
        >
          Subject{' '}
          <span className="text-muted-foreground">(optional)</span>
        </label>

        <input
          id="subject"
          name="subject"
          className={fieldClasses}
          placeholder="What's this about?"
          value={form.subject}
          onChange={(e) =>
            setForm({ ...form, subject: e.target.value })
          }
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium"
        >
          Message
        </label>

        <textarea
          id="message"
          name="message"
          rows={5}
          className={`${fieldClasses} resize-y`}
          placeholder="Tell me about your project..."
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        {errors.message && (
          <p className="mt-1.5 text-sm text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="self-start"
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}