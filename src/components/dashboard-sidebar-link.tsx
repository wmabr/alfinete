'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps, ReactNode } from 'react'

interface DashboardSidebarLinkProps extends ComponentProps<typeof Link> {
  icon: ReactNode
}

export function DashboardSidebarLink({
  href,
  className,
  icon,
  children,
  ...props
}: DashboardSidebarLinkProps) {
  const isActive = href === usePathname()

  return (
    <Link
      href={href}
      data-active={isActive}
      className={cn(
        'flex items-center gap-2 w-full p-4 text-zinc-600 hover:bg-zinc-100 rounded-lg data-[active=true]:text-purple-700',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  )
}
