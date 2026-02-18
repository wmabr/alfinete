import { cn } from '@/lib/utils'
import { LoaderCircleIcon } from 'lucide-react'
import { ComponentProps } from 'react'

interface ButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  isLoading = false,
  variant = 'primary',
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'flex items-center justify-center gap-2 px-4 h-10 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
        variant === 'primary' && 'text-white bg-purple-500 hover:bg-purple-600',
        variant === 'secondary' &&
          'border border-zinc-200 text-zinc-700 hover:bg-zinc-50',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <LoaderCircleIcon className="size-4 animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}
