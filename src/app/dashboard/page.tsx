import { NoticesListTable } from '@/components/notices-list-table'
import { PlusIcon } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="font-bold text-2xl">Avisos</h2>
        <button className="flex items-center gap-2 p-2 text-sm text-white bg-purple-500 rounded-lg cursor-pointer">
          <PlusIcon className="size-4" />
          Novo aviso
        </button>
      </div>
      <NoticesListTable />
    </div>
  )
}
