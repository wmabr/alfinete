'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { NoticesListTableItem } from './notices-list-table-item'
import { fetchRecentNotices } from '@/services/fetch-recent-notices'

export function NoticesListTable() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = Number(searchParams.get('page')) || 1

  const { data, isLoading } = useQuery({
    queryKey: ['notices', page],
    queryFn: () => fetchRecentNotices({ page }),
  })

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left">
              <th className="px-4 py-3 font-medium">Autor</th>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Início</th>
              <th className="px-4 py-3 font-medium">Expiração</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-600">
                  Carregando...
                </td>
              </tr>
            )}

            {!isLoading && data?.notices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-600">
                  Nenhum aviso encontrado.
                </td>
              </tr>
            )}

            {data?.notices.map((notice) => (
              <NoticesListTableItem key={notice.id} notice={notice} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200">
        <span className="text-sm text-zinc-500">
          Página {page} de {data?.totalPages ?? 1} &bull;{' '}
          {data?.totalCount ?? 0} {data?.totalCount === 1 ? 'aviso' : 'avisos'}
        </span>

        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <button
            disabled={page >= (data?.totalPages ?? 1)}
            onClick={() => goToPage(page + 1)}
            className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
