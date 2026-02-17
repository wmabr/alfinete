'use client'

import { cn } from '@/lib/utils'
import { MenuIcon } from 'lucide-react'
import { ComponentProps } from 'react'
import { DashboardHeaderProfileDropdownMenu } from './dashboard-header-profile-dropdown-menu'
import { useSidebar } from './dashboard-sidebar-provider'

interface HeaderProps extends ComponentProps<'header'> {}

export function DashboardHeader({ className, ...props }: HeaderProps) {
  const { toggle } = useSidebar()

  return (
    <header
      className={cn(
        'flex items-center justify-between gap-4 p-4 border-b border-zinc-200 md:justify-end',
        className,
      )}
      {...props}
    >
      <button
        onClick={toggle}
        className="p-1 text-zinc-500 hover:text-zinc-700 md:hidden"
      >
        <MenuIcon className="size-5" />
      </button>

      <DashboardHeaderProfileDropdownMenu />
    </header>
  )
}
