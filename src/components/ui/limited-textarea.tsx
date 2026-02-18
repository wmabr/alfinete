import { ComponentProps, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface LimitedTextareaProps extends ComponentProps<'textarea'> {
  label: string
  limit: number
  currentLength: number
  error?: string
}

export const LimitedTextarea = forwardRef<
  HTMLTextAreaElement,
  LimitedTextareaProps
>(function LimitedTextarea(
  { label, limit, currentLength, error, className, ...props },
  ref,
) {
  const isOver = currentLength > limit

  return (
    <label className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">{label}</span>
        <span
          className={`text-xs tabular-nums ${isOver ? 'text-red-500' : 'text-zinc-400'}`}
        >
          {currentLength}/{limit}
        </span>
      </div>
      <textarea
        ref={ref}
        className={cn(
          'w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg resize-none',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </label>
  )
})
