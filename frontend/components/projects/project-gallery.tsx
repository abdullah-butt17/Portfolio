'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Lightbox } from './lightbox'
import type { Media } from '@/lib/types'

export function ProjectGallery({ images }: { images: Media[] }) {
  const [index, setIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((shot, i) => (
          <button
            key={shot.publicId}
            onClick={() => setIndex(i)}
            className="relative aspect-video overflow-hidden rounded-xl border border-border outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <Image
              src={shot.url}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>
      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </>
  )
}
