import { EditNoticeForm } from '@/components/edit-notice-form'
import { getNotice } from '@/services/get-notice'
import { dayjs } from '@/lib/dayjs'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface NoticePageProps {
  params: Promise<{ id: string }>
}

export default async function NoticePage({ params }: NoticePageProps) {
  const { id } = await params
  const notice = await getNotice(id)

  if (!notice) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        <ChevronLeftIcon className="size-4" />
        Avisos
      </Link>

      <EditNoticeForm
        notice={{
          ...notice,
          content: notice.content ?? null,
          imageId: notice.imageId ?? null,
          imageUrl: notice.imageUrl ?? null,
          startDate: dayjs(notice.startDate).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
          endDate: dayjs(notice.endDate).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
        }}
      />
    </div>
  )
}
