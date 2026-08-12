'use client'

import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function TagInput({ label, values, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState('')

  const addTag = () => {
    const trimmed = draft.trim()
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed])
    setDraft('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !draft && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface/60 p-2.5 focus-within:border-primary/60">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-xs"
          >
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder || 'Type and press Enter'}
          className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}
