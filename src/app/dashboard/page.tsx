import { CreateNoticeDialog } from '@/components/create-notice-dialog'
import { NoticesListTable } from '@/components/notices-list-table'

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="font-bold text-2xl">Avisos</h2>
        <CreateNoticeDialog />
      </div>
      <NoticesListTable />
    </div>
  )
}
