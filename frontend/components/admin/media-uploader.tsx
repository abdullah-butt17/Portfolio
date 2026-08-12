'use client'

import { useRef, useState, type DragEvent } from 'react'
import Image from 'next/image'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { adminProjectApi } from '@/lib/admin-api'
import { useToast } from '@/lib/toast-context'
import { getApiErrorMessage } from '@/lib/http'
import type { Media } from '@/lib/types'

interface MediaUploaderProps {
  projectId: string
  type: 'thumbnail' | 'screenshot' | 'video'
  label: string
  current?: Media | null
  gallery?: Media[]
  /** Called after a successful upload or delete so the parent can refresh project state. */
  onUploaded: () => void
}

export function MediaUploader({ projectId, type, label, current, gallery, onUploaded }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const toast = useToast()

  const accept =
    type === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/jpeg,image/png,image/webp,image/gif'

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setProgress(0)
    try {
      await adminProjectApi.uploadMedia(projectId, file, type, setProgress)
      toast.success('Upload complete')
      onUploaded()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setProgress(null)
    }
  }

  const handleDelete = async (publicId: string) => {
    try {
      await adminProjectApi.deleteMedia(projectId, publicId)
      toast.success('Media removed')
      onUploaded()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const isBusy = progress !== null

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>

      {type !== 'screenshot' && current?.url && (
        <div className="relative mb-3 w-fit">
          {type === 'video' ? (
            /* eslint-disable-next-line jsx-a11y/media-has-caption */
            <video src={current.url} className="h-32 rounded-lg border border-border" controls />
          ) : (
            <div className="relative h-32 w-52 overflow-hidden rounded-lg border border-border">
              <Image src={current.url} alt="" fill className="object-cover" />
            </div>
          )}
          <button
            type="button"
            onClick={() => handleDelete(current.publicId)}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
            aria-label="Remove"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      {type === 'screenshot' && gallery && gallery.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {gallery.map((shot) => (
            <div key={shot.publicId} className="relative h-24 w-24 overflow-hidden rounded-lg border border-border">
              <Image src={shot.url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(shot.publicId)}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
                aria-label="Remove"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
      >
        {isBusy ? (
          <>
            <Loader2 className="size-5 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Uploading… {progress}%</p>
          </>
        ) : (
          <>
            <UploadCloud className="size-5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Drag & drop or click to upload</p>
          </>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
    </div>
  )
}
