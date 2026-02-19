import { NoticesListTable } from '@/components/notices-list-table'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="font-bold text-2xl">Avisos</h2>
        <Link
          href="/dashboard/notices/new"
          className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
        >
          <PlusIcon className="size-4" />
          Novo aviso
        </Link>
      </div>
      <NoticesListTable />
    </div>
  )
}
