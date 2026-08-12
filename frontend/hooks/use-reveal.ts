'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Reveal an element when it scrolls into view.
 * Adds the `is-visible` class once, respecting reduced-motion via CSS.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px', ...options },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return { ref, visible }
}
