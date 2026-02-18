import { dayjs } from '@/lib/dayjs'
import { Avatar } from './ui/avatar'
import { noticeListItemSchema } from '@/http/schemas/notices'
import { z } from 'zod'
import Link from 'next/link'

const statusLabels: Record<string, string> = {
  DRAFT: 'Rascunho',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  ARCHIVED: 'Arquivado',
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-zinc-100 text-zinc-600',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PAUSED: 'bg-amber-100 text-amber-700',
  ARCHIVED: 'bg-red-100 text-red-700',
}

interface NoticesListTableItemProps {
  notice: z.infer<typeof noticeListItemSchema>
}

export function NoticesListTableItem({ notice }: NoticesListTableItemProps) {
  return (
    <tr
      key={notice.id}
      className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors"
    >
      <td className="px-4 py-3">
        <Avatar
          src={notice.authorImageUrl ?? ''}
          fallback="?"
          className="size-7"
        />
      </td>
      <td className="px-4 py-3 text-zinc-800 hover:underline">
        <Link href={`/dashboard/notices/${notice.id}`}>{notice.title}</Link>
      </td>
      <td className="px-4 py-3 font-mono text-zinc-600">{notice.type.toLowerCase()}</td>
      <td className="px-4 py-3 text-zinc-600">
        {dayjs(notice.startDate).format('ll')}
      </td>
      <td className="px-4 py-3 text-zinc-600">
        {dayjs(notice.endDate).format('ll')}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[notice.status]}`}
        >
          {statusLabels[notice.status]}
        </span>
      </td>
    </tr>
  )
}
