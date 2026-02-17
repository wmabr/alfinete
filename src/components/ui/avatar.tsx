import { cn } from '@/lib/utils'
import * as RadixAvatar from '@radix-ui/react-avatar'

interface AvatarProps extends RadixAvatar.AvatarProps {
  src: string
  alt?: string
  fallback: string
}

export function Avatar({ src, alt, fallback, className }: AvatarProps) {
  return (
    <RadixAvatar.Root>
      <RadixAvatar.Image
        src={src}
        alt={alt}
        className={cn('rounded-full object-cover', className)}
      />
      <RadixAvatar.Fallback delayMs={600}>{fallback}</RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
