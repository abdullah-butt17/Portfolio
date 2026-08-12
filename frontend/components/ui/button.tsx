import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_60%,transparent)] hover:shadow-[0_8px_30px_-8px_color-mix(in_oklch,var(--primary)_70%,transparent)]',
        accent:
          'bg-accent text-accent-foreground hover:brightness-110 hover:-translate-y-0.5',
        outline:
          'border border-border-strong bg-surface/40 text-foreground hover:bg-surface-2 hover:border-primary/50 hover:-translate-y-0.5',
        ghost: 'text-muted-foreground hover:text-foreground hover:bg-surface',
        link: 'text-foreground underline-offset-4 hover:text-primary rounded-none px-0',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type BaseProps = VariantProps<typeof buttonVariants> & { className?: string }

type ButtonAsButton = BaseProps &
  ComponentProps<'button'> & { href?: undefined }
type ButtonAsLink = BaseProps &
  Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({ className, variant, size, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className)

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink
    const external = /^https?:\/\//.test(href) || href.startsWith('mailto:')
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noreferrer"
          {...(rest as ComponentProps<'a'>)}
        />
      )
    }
    return <Link href={href} className={classes} {...rest} />
  }

  return <button className={classes} {...(props as ButtonAsButton)} />
}

export { buttonVariants }
