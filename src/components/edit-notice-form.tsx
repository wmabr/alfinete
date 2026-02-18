'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  editNoticeFormSchema,
  EditNoticeFormSchema,
  typeLimits,
} from '@/schemas/edit-notice-form-schema'
import { updateNotice } from '@/services/update-notice'
import { useRouter } from 'next/navigation'
import { LimitedInput } from './ui/limited-input'
import { LimitedTextarea } from './ui/limited-textarea'
import { ImageUploader } from './ui/image-uploader'
import { Button } from './ui/button'

interface NoticeData {
  id: string
  title: string
  content: string | null
  type: 'TOAST' | 'MODAL' | 'BANNER'
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
  dismissible: boolean
  startDate: string
  endDate: string
  imageId: string | null
  imageUrl: string | null
}

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

interface EditNoticeFormProps {
  notice: NoticeData
}

export function EditNoticeForm({ notice }: EditNoticeFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<EditNoticeFormSchema>({
    resolver: zodResolver(editNoticeFormSchema),
    defaultValues: {
      title: notice.title,
      content: notice.content ?? '',
      imageId: notice.imageId ?? '',
      type: notice.type,
      status: notice.status,
      dismissible: notice.dismissible,
      startDate: notice.startDate,
      endDate: notice.endDate,
    },
  })

  const currentType = watch('type')
  const titleValue = watch('title') ?? ''
  const contentValue = watch('content') ?? ''
  const limits = typeLimits[currentType]

  async function onSubmit(data: EditNoticeFormSchema) {
    await updateNotice(notice.id, data)
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-2xl">{notice.title}</h1>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[notice.status]}`}
          >
            {statusLabels[notice.status]}
          </span>
        </div>

        <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
          Salvar alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-4 p-6 border border-zinc-200 rounded-lg">
          <LimitedInput
            label="Título"
            limit={limits.title}
            currentLength={titleValue.length}
            error={errors.title?.message}
            {...register('title')}
          />

          <LimitedTextarea
            label="Conteúdo"
            limit={limits.content}
            currentLength={contentValue.length}
            error={errors.content?.message}
            rows={4}
            {...register('content')}
          />

          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-500">Imagem</span>
            <ImageUploader
              initialUrl={notice.imageUrl}
              disabled={currentType !== 'MODAL'}
              onUpload={(imageId) =>
                setValue('imageId', imageId, { shouldDirty: true })
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 p-6 border border-zinc-200 rounded-lg">
            <h2 className="font-medium text-zinc-700">Configurações</h2>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-500">Status</span>
              <select
                className="w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg"
                {...register('status')}
              >
                <option value="DRAFT">Rascunho</option>
                <option value="ACTIVE">Ativo</option>
                <option value="PAUSED">Pausado</option>
                <option value="ARCHIVED">Arquivado</option>
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-500">Tipo</span>
              <select
                className="w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg"
                {...register('type')}
              >
                <option value="TOAST">Toast</option>
                <option value="MODAL">Modal</option>
                <option value="BANNER">Banner</option>
              </select>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 accent-purple-500"
                {...register('dismissible')}
              />
              <span className="text-sm text-zinc-500">Dispensável</span>
            </label>
          </div>

          <div className="flex flex-col gap-4 p-6 border border-zinc-200 rounded-lg">
            <h2 className="font-medium text-zinc-700">Período</h2>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-500">Data de início</span>
              <input
                type="date"
                className="w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg"
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className="text-xs text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-500">Data de expiração</span>
              <input
                type="date"
                className="w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg"
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className="text-xs text-red-500">{errors.endDate.message}</p>
              )}
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
