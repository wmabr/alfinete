import { ComponentProps, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface LimitedInputProps extends ComponentProps<'input'> {
  label: string
  limit: number
  currentLength: number
  error?: string
}

export const LimitedInput = forwardRef<HTMLInputElement, LimitedInputProps>(
  function LimitedInput(
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
        <input
          ref={ref}
          className={cn(
            'w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </label>
    )
  },
)
