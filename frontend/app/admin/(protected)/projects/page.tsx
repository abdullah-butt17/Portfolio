'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badges'
import { EmptyState, ErrorState, Skeleton } from '@/components/admin/states'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { adminProjectApi } from '@/lib/admin-api'
import { useToast } from '@/lib/toast-context'
import { getApiErrorMessage } from '@/lib/http'
import { cn } from '@/lib/utils'
import type { Pagination, Project, ProjectCategory } from '@/lib/types'

const CATEGORIES: (ProjectCategory | 'All')[] = ['All', 'Full Stack', 'AI / ML', 'University', 'Personal', 'Other']

export default function AdminProjectsPage() {
  const toast = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [pagination, setPagination] = useState<Pagination | undefined>()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProjectCategory | 'All'>('All')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(() => {
    setIsLoading(true)
    setIsError(false)
    adminProjectApi
      .list({
        search: search || undefined,
        category: category === 'All' ? undefined : category,
        page,
        limit: 10,
      })
      .then((res) => {
        setProjects(res.projects)
        setPagination(res.pagination)
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false))
  }, [search, category, page])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await adminProjectApi.remove(deleteTarget.id)
      toast.success('Project deleted')
      setDeleteTarget(null)
      load()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleFeatured = async (project: Project) => {
    try {
      await adminProjectApi.setFeatured(project.id, !project.featured)
      toast.success(!project.featured ? 'Marked as featured' : 'Removed from featured')
      load()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const togglePublished = async (project: Project) => {
    try {
      await adminProjectApi.setPublished(project.id, !project.published)
      toast.success(!project.published ? 'Published' : 'Unpublished')
      load()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your portfolio projects.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button size="sm">
            <Plus className="size-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-border bg-surface/60 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/60"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c)
                setPage(1)
              }}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                category === c
                  ? 'border-primary/50 bg-primary/15 text-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}

        {!isLoading && isError && <ErrorState title="Unable to load projects." onRetry={load} />}

        {!isLoading && !isError && projects.length === 0 && (
          <EmptyState title="No projects yet." description="Create your first project to get started." />
        )}

        {!isLoading && !isError && projects.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface/60 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Category</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Status</th>
                  <th className="px-4 py-3 font-medium">Flags</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-surface/40">
                    <td className="px-4 py-3">
                      <p className="font-medium">{project.title}</p>
                      <p className="text-xs text-muted-foreground">/{project.slug}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{project.category}</td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFeatured(project)}
                          aria-label="Toggle featured"
                          className={cn('rounded-full p-1.5', project.featured ? 'text-primary' : 'text-muted-foreground')}
                        >
                          <Star className="size-4" fill={project.featured ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => togglePublished(project)}
                          aria-label="Toggle published"
                          className={cn('rounded-full p-1.5', project.published ? 'text-emerald-400' : 'text-muted-foreground')}
                        >
                          {project.published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={cn(
                  'size-8 rounded-full text-sm',
                  pagination.page === i + 1 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-surface',
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project?"
        description={`"${deleteTarget?.title}" will be permanently removed. This action cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
