'use client'

import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOutIcon } from 'lucide-react'
import { Avatar } from './ui/avatar'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function DashboardHeaderProfileDropdownMenu() {
  const { data: session } = authClient.useSession()

  const name = session?.user.name ?? ''
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  const router = useRouter()

  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger className="outline-none">
        <Avatar
          src={session?.user.image ?? ''}
          fallback={initials}
          className="size-8"
        />
      </RadixDropdownMenu.Trigger>

      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content className="min-w-48 p-2 bg-white border border-zinc-200 rounded-lg">
          <RadixDropdownMenu.Item
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors duration-150 outline-none cursor-pointer rounded-lg"
            onSelect={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push('/login')
                  },
                },
              })
            }}
          >
            <LogOutIcon className="size-4" />
            <span>Sair</span>
          </RadixDropdownMenu.Item>
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  )
}
