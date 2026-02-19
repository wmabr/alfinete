'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  editNoticeFormSchema,
  EditNoticeFormSchema,
  typeLimits,
} from '@/schemas/edit-notice-form-schema'
import { createNotice } from '@/services/create-notice'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LimitedInput } from './ui/limited-input'
import { LimitedTextarea } from './ui/limited-textarea'
import { ImageUploader } from './ui/image-uploader'
import { Button } from './ui/button'

export function CreateNoticeForm() {
  const router = useRouter()
  const [submitStatus, setSubmitStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<EditNoticeFormSchema>({
    resolver: zodResolver(editNoticeFormSchema),
    defaultValues: {
      title: '',
      content: '',
      imageId: '',
      type: 'TOAST',
      status: 'DRAFT',
      dismissible: false,
      startDate: '',
      endDate: '',
    },
  })

  const currentType = watch('type')
  const titleValue = watch('title') ?? ''
  const contentValue = watch('content') ?? ''
  const limits = typeLimits[currentType]

  async function onSubmit(data: EditNoticeFormSchema) {
    await createNotice({ ...data, status: submitStatus })
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-bold text-2xl">Novo aviso</h1>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="secondary"
            isLoading={isSubmitting && submitStatus === 'DRAFT'}
            disabled={isSubmitting}
            onClick={() => setSubmitStatus('DRAFT')}
          >
            Salvar rascunho
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting && submitStatus === 'ACTIVE'}
            disabled={isSubmitting}
            onClick={() => setSubmitStatus('ACTIVE')}
          >
            Publicar
          </Button>
        </div>
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
