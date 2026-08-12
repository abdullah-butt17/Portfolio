'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  Plus,
  Trash2,
  Pencil,
  X,
  UploadCloud,
  FileText,
  ExternalLink,
  Trash,
} from 'lucide-react'

import { Input, Select } from '@/components/admin/form-fields'
import { Button } from '@/components/ui/button'
import {
  Skeleton,
  EmptyState,
  ErrorState,
} from '@/components/admin/states'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'

import { getSkills } from '@/lib/api'
import {
  adminSkillApi,
  type SkillFormInput,
} from '@/lib/admin-api'

import { useToast } from '@/lib/toast-context'
import { getApiErrorMessage } from '@/lib/http'

import type {
  Skill,
  SkillLevel,
} from '@/lib/types'

const LEVELS: SkillLevel[] = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
]

const emptyForm: SkillFormInput = {
  name: '',
  category: '',
  level: 'intermediate',
  displayOrder: 0,
}

export default function AdminSkillsPage() {
  const toast = useToast()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [skills, setSkills] = useState<Skill[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] =
    useState<SkillFormInput>(emptyForm)

  const [selectedCertificate, setSelectedCertificate] =
    useState<File | null>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingCertificate, setIsUploadingCertificate] =
    useState(false)

  const [deleteTarget, setDeleteTarget] =
    useState<Skill | null>(null)

  const [isDeleting, setIsDeleting] =
    useState(false)

  const load = async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      const data = await getSkills()
      setSkills(data)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setSelectedCertificate(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const openEdit = (skill: Skill) => {
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      displayOrder: skill.displayOrder,
    })

    setEditingId(skill.id)
    setSelectedCertificate(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setShowForm(true)
  }

  const handleCertificateChange = (
    file: File | undefined,
  ) => {
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        'Please select a PDF or image certificate.',
      )

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      return
    }

    setSelectedCertificate(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (isSaving) return

    if (!form.name.trim()) {
      toast.error('Skill name is required')
      return
    }

    setIsSaving(true)

    try {
      let savedSkill: Skill

      if (editingId) {
        savedSkill = await adminSkillApi.update(
          editingId,
          form,
        )

        toast.success('Skill updated')
      } else {
        savedSkill = await adminSkillApi.create(form)

        toast.success('Skill created')
      }

      /*
       * Certificate is OPTIONAL.
       *
       * We first save the skill, then upload the certificate
       * only if the user selected one.
       */
      if (selectedCertificate) {
        setIsUploadingCertificate(true)

        savedSkill =
          await adminSkillApi.uploadCertificate(
            savedSkill.id,
            selectedCertificate,
          )

        toast.success('Certificate uploaded')
      }

      setShowForm(false)
      resetForm()

      /*
       * Reload the list so the certificate/current data
       * is immediately reflected in the table.
       */
      await load()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setIsSaving(false)
      setIsUploadingCertificate(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return

    setIsDeleting(true)

    try {
      await adminSkillApi.remove(deleteTarget.id)

      toast.success('Skill deleted')

      setDeleteTarget(null)

      await load()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCertificate = async (
    skill: Skill,
  ) => {
    try {
      await adminSkillApi.deleteCertificate(skill.id)

      toast.success('Certificate deleted')

      await load()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Skills
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Technologies displayed on your portfolio.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={openCreate}
        >
          <Plus className="size-4" />
          Add Skill
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-border bg-surface/40 p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">
              {editingId
                ? 'Edit Skill'
                : 'New Skill'}
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
              aria-label="Close"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Skill fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="skillName"
              label="Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
            />

            <Input
              id="skillCategory"
              label="Category"
              placeholder="e.g. Frontend"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            />

            <Select
              id="skillLevel"
              label="Level"
              value={form.level}
              onChange={(e) =>
                setForm({
                  ...form,
                  level: e.target.value as SkillLevel,
                })
              }
            >
              {LEVELS.map((level) => (
                <option
                  key={level}
                  value={level}
                >
                  {level}
                </option>
              ))}
            </Select>

            <Input
              id="skillOrder"
              type="number"
              label="Display Order"
              value={form.displayOrder}
              onChange={(e) =>
                setForm({
                  ...form,
                  displayOrder: Number(
                    e.target.value,
                  ),
                })
              }
            />
          </div>

          {/* Certificate */}
          <div className="space-y-2">
            <label
              htmlFor="skillCertificate"
              className="block text-sm font-medium"
            >
              Certificate
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (Optional)
              </span>
            </label>

            <div className="rounded-xl border border-dashed border-border bg-surface/40 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-surface-2">
                    <FileText className="size-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    {selectedCertificate ? (
                      <>
                        <p className="truncate text-sm font-medium">
                          {selectedCertificate.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          New certificate selected
                        </p>
                      </>
                    ) : editingId ? (
                      (() => {
                        const currentSkill =
                          skills.find(
                            (skill) =>
                              skill.id === editingId,
                          )

                        if (
                          currentSkill?.certificate
                        ) {
                          return (
                            <>
                              <p className="truncate text-sm font-medium">
                                {
                                  currentSkill
                                    .certificate.name
                                }
                              </p>

                              <p className="text-xs text-muted-foreground">
                                Current certificate
                              </p>
                            </>
                          )
                        }

                        return (
                          <p className="text-sm text-muted-foreground">
                            No certificate uploaded
                          </p>
                        )
                      })()
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No certificate selected
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={
                      isSaving ||
                      isUploadingCertificate
                    }
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    <UploadCloud className="size-4" />

                    {selectedCertificate
                      ? 'Change File'
                      : 'Choose File'}
                  </Button>

                  <input
                    ref={fileInputRef}
                    id="skillCertificate"
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) =>
                      handleCertificateChange(
                        e.target.files?.[0],
                      )
                    }
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Optional. PDF, JPG, PNG, WEBP or GIF.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isSaving ||
                isUploadingCertificate
              }
            >
              {isUploadingCertificate
                ? 'Uploading Certificate…'
                : isSaving
                  ? 'Saving…'
                  : editingId
                    ? 'Save Changes'
                    : 'Create'}
            </Button>
          </div>
        </form>
      )}

      {/* Skills list */}
      <div className="mt-6">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map(
              (_, i) => (
                <Skeleton
                  key={i}
                  className="h-14 w-full"
                />
              ),
            )}
          </div>
        )}

        {!isLoading && isError && (
          <ErrorState
            title="Unable to load skills."
            onRetry={load}
          />
        )}

        {!isLoading &&
          !isError &&
          skills.length === 0 && (
            <EmptyState
              title="No skills yet."
              description="Add your first skill above."
            />
          )}

        {!isLoading &&
          !isError &&
          skills.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface/60 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">
                      Name
                    </th>

                    <th className="hidden px-4 py-3 font-medium sm:table-cell">
                      Category
                    </th>

                    <th className="hidden px-4 py-3 font-medium md:table-cell">
                      Level
                    </th>

                    <th className="hidden px-4 py-3 font-medium lg:table-cell">
                      Certificate
                    </th>

                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {skills
                    .slice()
                    .sort(
                      (a, b) =>
                        a.displayOrder -
                        b.displayOrder,
                    )
                    .map((skill) => (
                      <tr
                        key={skill.id}
                        className="hover:bg-surface/40"
                      >
                        <td className="px-4 py-3 font-medium">
                          {skill.name}
                        </td>

                        <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                          {skill.category}
                        </td>

                        <td className="hidden px-4 py-3 capitalize text-muted-foreground md:table-cell">
                          {skill.level}
                        </td>

                        <td className="hidden px-4 py-3 lg:table-cell">
                          {skill.certificate ? (
                            <div className="flex items-center gap-2">
                              <a
                                href={
                                  skill.certificate
                                    .url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                              >
                                <FileText className="size-4" />
                                View
                                <ExternalLink className="size-3" />
                              </a>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCertificate(
                                    skill,
                                  )
                                }
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                aria-label="Delete certificate"
                              >
                                <Trash className="size-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              None
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                openEdit(skill)
                              }
                              className="rounded-lg p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                              aria-label="Edit"
                            >
                              <Pencil className="size-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget(
                                  skill,
                                )
                              }
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
      </div>

      {/* Delete skill confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Skill?"
        description={`"${deleteTarget?.name}" will be permanently removed.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteTarget(null)
        }
      />
    </div>
  )
}