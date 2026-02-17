'use client'

import { DashboardSidebarLink } from './dashboard-sidebar-link'
import { HouseIcon, LineSquiggleIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useSidebar } from './dashboard-sidebar-provider'

export function DashboardSidebar() {
  const { isOpen, close } = useSidebar()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={close}
        />
      )}

      <aside
        data-open={isOpen}
        className="fixed inset-y-0 left-0 z-50 flex flex-col items-start justify-between p-4 w-64 h-full bg-white border-r border-zinc-200 -translate-x-full data-[open=true]:translate-x-0 transition-transform duration-200 md:static md:translate-x-0"
      >
        <div className="flex items-center justify-between w-full">
          <Link
            href={'/dashboard'}
            className="flex items-center gap-2 font-bold text-xl"
          >
            <LineSquiggleIcon className="size-6 text-purple-500" />
            Alfinete
          </Link>

          <button
            onClick={close}
            className="p-1 text-zinc-500 hover:text-zinc-700 md:hidden"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-0 w-full">
          <DashboardSidebarLink
            href="/dashboard"
            icon={<HouseIcon className="size-5" />}
            onClick={close}
          >
            Home
          </DashboardSidebarLink>
        </nav>

        <p className="text-xs text-zinc-500">
          Todos os direitos reservados &copy; {new Date().getFullYear()} WMA
          PERSONALIZADOS LTDA
        </p>
      </aside>
    </>
  )
}
