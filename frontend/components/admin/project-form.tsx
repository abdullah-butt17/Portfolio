'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Input, Textarea, Select } from '@/components/admin/form-fields'
import { TagInput } from '@/components/admin/tag-input'
import { MediaUploader } from '@/components/admin/media-uploader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/admin/states'
import { adminProjectApi } from '@/lib/admin-api'
import { useToast } from '@/lib/toast-context'
import { getApiErrorMessage } from '@/lib/http'

import type {
  Project,
  ProjectCategory,
  ProjectFormInput,
  ProjectStatus,
} from '@/lib/types'

const CATEGORIES: ProjectCategory[] = [
  'Full Stack',
  'AI / ML',
  'University',
  'Personal',
  'Other',
]

const STATUSES: ProjectStatus[] = [
  'completed',
  'in-progress',
  'archived',
]

const emptyForm: ProjectFormInput = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  category: 'Full Stack',
  technologies: [],
  features: [],
  githubUrl: '',
  liveUrl: '',
  status: 'in-progress',
  featured: false,
  published: false,
  displayOrder: 0,
  startDate: '',
  completionDate: '',
}

function toFormInput(project: Project): ProjectFormInput {
  return {
    title: project.title,
    shortDescription: project.description,
    fullDescription: project.fullDescription || '',
    category: project.category,
    technologies: project.technologies,
    features: project.features,
    githubUrl:
      project.links.find((link) => link.type === 'github')?.href || '',
    liveUrl:
      project.links.find((link) => link.type === 'demo')?.href || '',
    status: project.status,
    featured: project.featured,
    published: project.published,
    displayOrder: project.displayOrder,
    startDate: project.startDate
      ? project.startDate.slice(0, 10)
      : '',
    completionDate: project.completionDate
      ? project.completionDate.slice(0, 10)
      : '',
  }
}

export function ProjectForm({
  projectId,
}: {
  projectId?: string
}) {
  const isEdit = !!projectId

  const router = useRouter()
  const toast = useToast()

  const [project, setProject] = useState<Project | null>(null)
  const [form, setForm] =
    useState<ProjectFormInput>(emptyForm)

  const [errors, setErrors] =
    useState<Record<string, string>>({})

  const [isLoadingExisting, setIsLoadingExisting] =
    useState(isEdit)

  const [isSaving, setIsSaving] = useState(false)

  const refetch = () => {
    if (!projectId) return

    adminProjectApi
      .getById(projectId)
      .then(setProject)
      .catch((err) => {
        toast.error(getApiErrorMessage(err))
      })
  }

  useEffect(() => {
    if (!projectId) return

    setIsLoadingExisting(true)

    adminProjectApi
      .getById(projectId)
      .then((p) => {
        setProject(p)
        setForm(toFormInput(p))
      })
      .catch((err) => {
        toast.error(getApiErrorMessage(err))
      })
      .finally(() => {
        setIsLoadingExisting(false)
      })
  }, [projectId])

  const update = <
    K extends keyof ProjectFormInput
  >(
    key: K,
    value: ProjectFormInput[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const validate = () => {
    const next: Record<string, string> = {}

    if (!form.title.trim()) {
      next.title = 'Title is required'
    }

    if (!form.shortDescription.trim()) {
      next.shortDescription =
        'Short description is required'
    }

    if (
      form.githubUrl &&
      !/^https?:\/\//.test(form.githubUrl)
    ) {
      next.githubUrl = 'Must be a valid URL'
    }

    if (
      form.liveUrl &&
      !/^https?:\/\//.test(form.liveUrl)
    ) {
      next.liveUrl = 'Must be a valid URL'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const payload: ProjectFormInput = {
      ...form,

      startDate: form.startDate || undefined,
      completionDate:
        form.completionDate || undefined,

      githubUrl: form.githubUrl || undefined,

      // Live demo is completely optional.
      liveUrl: form.liveUrl || undefined,
    }

    setIsSaving(true)

    try {
      if (isEdit && projectId) {
        await adminProjectApi.update(
          projectId,
          payload,
        )

        toast.success('Project updated')

        // Return to the projects list after saving.
        router.push('/admin/projects')

        return
      } else {
        const created =
          await adminProjectApi.create(payload)

        toast.success('Project created')

        // After creating a new project, open its edit page
        // so media can be uploaded.
        router.replace(
          `/admin/projects/${created.id}/edit`,
        )

        return
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (isEdit && isLoadingExisting) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to projects
      </Link>

      <h1 className="text-2xl font-semibold">
        {isEdit ? 'Edit Project' : 'New Project'}
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 space-y-8"
      >
        {/* BASIC INFORMATION */}
        <section className="space-y-4 rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            Basic Information
          </h2>

          <Input
            id="title"
            label="Project Title"
            value={form.title}
            onChange={(e) =>
              update('title', e.target.value)
            }
            error={errors.title}
            required
          />

          <Textarea
            id="shortDescription"
            label="Short Description"
            value={form.shortDescription}
            onChange={(e) =>
              update(
                'shortDescription',
                e.target.value,
              )
            }
            error={errors.shortDescription}
            maxLength={300}
          />

          <Textarea
            id="fullDescription"
            label="Full Description"
            value={form.fullDescription}
            onChange={(e) =>
              update(
                'fullDescription',
                e.target.value,
              )
            }
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              id="category"
              label="Category"
              value={form.category}
              onChange={(e) =>
                update(
                  'category',
                  e.target.value as ProjectCategory,
                )
              }
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </Select>

            <Select
              id="status"
              label="Status"
              value={form.status}
              onChange={(e) =>
                update(
                  'status',
                  e.target.value as ProjectStatus,
                )
              }
            >
              {STATUSES.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </Select>
          </div>
        </section>

        {/* TECHNOLOGIES */}
        <section className="space-y-4 rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            Technologies & Features
          </h2>

          <TagInput
            label="Technologies"
            values={form.technologies}
            onChange={(value) =>
              update('technologies', value)
            }
            placeholder="e.g. React"
          />

          <TagInput
            label="Features"
            values={form.features}
            onChange={(value) =>
              update('features', value)
            }
            placeholder="e.g. Admin dashboard"
          />
        </section>

        {/* LINKS */}
        <section className="space-y-4 rounded-2xl border border-border bg-surface/40 p-6">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              Project Links
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              GitHub and Live Demo links are optional.
              If the project is not hosted, upload a
              walkthrough recording below instead.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="githubUrl"
              label="GitHub URL (Optional)"
              value={form.githubUrl}
              onChange={(e) =>
                update('githubUrl', e.target.value)
              }
              error={errors.githubUrl}
              placeholder="https://github.com/..."
            />

            <Input
              id="liveUrl"
              label="Live Demo URL (Optional)"
              value={form.liveUrl}
              onChange={(e) =>
                update('liveUrl', e.target.value)
              }
              error={errors.liveUrl}
              placeholder="https://..."
            />

            <Input
              id="startDate"
              type="date"
              label="Start Date"
              value={form.startDate}
              onChange={(e) =>
                update('startDate', e.target.value)
              }
            />

            <Input
              id="completionDate"
              type="date"
              label="Completion Date"
              value={form.completionDate}
              onChange={(e) =>
                update(
                  'completionDate',
                  e.target.value,
                )
              }
            />
          </div>
        </section>

        {/* MEDIA */}
        {isEdit && project && (
          <section className="space-y-6 rounded-2xl border border-border bg-surface/40 p-6">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Project Media
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Upload the project cover, screenshots,
                and a recording showing the project
                working. All media is uploaded through
                your existing Cloudinary backend.
              </p>
            </div>

            <MediaUploader
              projectId={project.id}
              type="thumbnail"
              label="Project Thumbnail"
              current={project.thumbnail}
              onUploaded={refetch}
            />

            <MediaUploader
              projectId={project.id}
              type="video"
              label="Project Demo / Walkthrough Recording"
              current={project.video}
              onUploaded={refetch}
            />

            <MediaUploader
              projectId={project.id}
              type="screenshot"
              label="Project Screenshots"
              gallery={project.gallery}
              onUploaded={refetch}
            />
          </section>
        )}

        {!isEdit && (
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">
              Media upload:
            </strong>{' '}
            Create the project first. After saving,
            you will be able to upload the thumbnail,
            walkthrough recording, and screenshots.
          </div>
        )}

        {/* VISIBILITY */}
        <section className="space-y-4 rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            Visibility
          </h2>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  update(
                    'featured',
                    e.target.checked,
                  )
                }
                className="size-4 accent-primary"
              />
              Featured
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  update(
                    'published',
                    e.target.checked,
                  )
                }
                className="size-4 accent-primary"
              />
              Published
            </label>
          </div>

          <Input
            id="displayOrder"
            type="number"
            label="Display Order"
            value={form.displayOrder}
            onChange={(e) =>
              update(
                'displayOrder',
                Number(e.target.value),
              )
            }
          />
        </section>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push('/admin/projects')
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? 'Saving…'
              : isEdit
                ? 'Save Changes'
                : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  )
}