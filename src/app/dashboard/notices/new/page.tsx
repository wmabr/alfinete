import { CreateNoticeForm } from '@/components/create-notice-form'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default function NewNoticePage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        <ChevronLeftIcon className="size-4" />
        Avisos
      </Link>

      <CreateNoticeForm />
    </div>
  )
}
