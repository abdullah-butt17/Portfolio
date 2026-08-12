'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Media } from '@/lib/types'

interface LightboxProps {
  images: Media[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, images.length, onClose, onNavigate])

  if (index === null) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close gallery"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full p-2 text-white/80 transition-colors hover:text-white"
      >
        <X className="size-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate((index - 1 + images.length) % images.length)
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 transition-colors hover:text-white sm:left-6"
          >
            <ChevronLeft className="size-7" />
          </button>
          <button
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate((index + 1) % images.length)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 transition-colors hover:text-white sm:right-6"
          >
            <ChevronRight className="size-7" />
          </button>
        </>
      )}

      <div
        className="relative h-[80vh] w-[90vw] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index].url}
          alt=""
          fill
          className="rounded-lg object-contain"
          sizes="90vw"
        />
      </div>
    </div>
  )
}
