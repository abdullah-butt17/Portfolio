'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Image from 'next/image'
import { UploadCloud } from 'lucide-react'

import { Input, Textarea } from '@/components/admin/form-fields'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/admin/states'

import { getProfile } from '@/lib/api'
import { adminProfileApi } from '@/lib/admin-api'
import { useToast } from '@/lib/toast-context'
import { getApiErrorMessage } from '@/lib/http'

import type { Profile } from '@/lib/types'

interface FormState {
  name: string
  headline: string
  bio: string
  location: string
  email: string
  phone: string
  githubUrl: string
  linkedinUrl: string
  resumeUrl: string
}

const emptyForm: FormState = {
  name: '',
  headline: '',
  bio: '',
  location: '',
  email: '',
  phone: '',
  githubUrl: '',
  linkedinUrl: '',
  resumeUrl: '',
}

function toFormState(profile: Profile): FormState {
  return {
    name: profile.name || '',
    headline: profile.title || '',
    bio: profile.shortBio || '',
    location: profile.location || '',
    email: profile.email || '',
    phone: profile.phone || '',

    githubUrl:
      profile.socials.find((social) => social.icon === 'github')?.href || '',

    linkedinUrl:
      profile.socials.find((social) => social.icon === 'linkedin')?.href || '',

    resumeUrl: profile.resumeUrl || '',
  }
}

export default function AdminProfilePage() {
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const loadProfile = async () => {
    try {
      const data = await getProfile()

      setProfile(data)
      setForm(toFormState(data))
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSaving) return

    setIsSaving(true)

    try {
      const updatedProfile = await adminProfileApi.update({
        name: form.name,
        headline: form.headline,
        bio: form.bio,
        location: form.location,
        email: form.email,
        phone: form.phone,
        githubUrl: form.githubUrl,
        linkedinUrl: form.linkedinUrl,
        resumeUrl: form.resumeUrl,
      })

      // Use the profile returned directly by PUT /api/profile.
      setProfile(updatedProfile)
      setForm(toFormState(updatedProfile))

      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageChange = async (file: File | undefined) => {
    if (!file || isUploading) return

    setIsUploading(true)

    try {
      const updatedProfile = await adminProfileApi.uploadImage(file)

      setProfile(updatedProfile)
      setForm(toFormState(updatedProfile))

      toast.success('Profile image updated')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setIsUploading(false)

      // Allow selecting the same file again.
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Manage the information shown on your public portfolio.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 space-y-6 rounded-2xl border border-border bg-surface/40 p-6"
      >
        {/* Profile Image */}
        <div>
          <p className="mb-2 text-sm font-medium">Profile Image</p>

          <div className="flex items-center gap-4">
            {profile?.profileImageUrl ? (
              <div className="relative size-16 overflow-hidden rounded-full border border-border">
                <Image
                  src={profile.profileImageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="grid size-16 place-items-center rounded-full border border-border text-xs text-muted-foreground">
                None
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="size-4" />

              {isUploading ? 'Uploading…' : 'Upload'}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0])}
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="name"
            label="Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />

          <Input
            id="headline"
            label="Headline"
            value={form.headline}
            onChange={(e) => update('headline', e.target.value)}
          />
        </div>

        {/* Bio */}
        <Textarea
          id="bio"
          label="Bio"
          value={form.bio}
          onChange={(e) => update('bio', e.target.value)}
        />

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="location"
            label="Location"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />

          <Input
            id="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />

          <Input
            id="phone"
            type="tel"
            label="Phone"
            placeholder="+92 300 1234567"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />

          <Input
            id="githubUrl"
            label="GitHub URL"
            placeholder="https://github.com/..."
            value={form.githubUrl}
            onChange={(e) => update('githubUrl', e.target.value)}
          />

          <Input
            id="linkedinUrl"
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/..."
            value={form.linkedinUrl}
            onChange={(e) => update('linkedinUrl', e.target.value)}
          />

          <Input
            id="resumeUrl"
            label="Resume URL"
            placeholder="https://..."
            value={form.resumeUrl}
            onChange={(e) => update('resumeUrl', e.target.value)}
          />
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}