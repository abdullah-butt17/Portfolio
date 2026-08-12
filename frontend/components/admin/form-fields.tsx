import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const fieldClasses =
  'w-full rounded-xl border border-border bg-surface/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/60'

function FieldWrapper({
  label,
  error,
  htmlFor,
  children,
}: {
  label?: string
  error?: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...rest }, ref) => (
    <FieldWrapper label={label} error={error} htmlFor={id}>
      <input
        ref={ref}
        id={id}
        className={cn(fieldClasses, error && 'border-destructive/60', className)}
        {...rest}
      />
    </FieldWrapper>
  ),
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, ...rest }, ref) => (
    <FieldWrapper label={label} error={error} htmlFor={id}>
      <textarea
        ref={ref}
        id={id}
        className={cn(fieldClasses, 'min-h-[110px] resize-y', error && 'border-destructive/60', className)}
        {...rest}
      />
    </FieldWrapper>
  ),
)
Textarea.displayName = 'Textarea'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className, children, ...rest }, ref) => (
    <FieldWrapper label={label} error={error} htmlFor={id}>
      <select
        ref={ref}
        id={id}
        className={cn(fieldClasses, error && 'border-destructive/60', className)}
        {...rest}
      >
        {children}
      </select>
    </FieldWrapper>
  ),
)
Select.displayName = 'Select'
