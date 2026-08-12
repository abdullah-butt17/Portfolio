'use client'

import { useState, useEffect, type FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/admin/form-fields'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { getApiErrorMessage } from '@/lib/http'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  )
}

function AdminLoginForm() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = searchParams.get('from') || '/admin'

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace(from)
  }, [authLoading, isAuthenticated, router, from])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login(email, password)
      router.replace(from)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid email or password'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-sm text-primary">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold">Sign in to your dashboard</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-2xl border border-border bg-surface/40 p-6"
        >
          <Input
            id="email"
            type="email"
            label="Email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
