'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createNoticeFormSchema,
  CreateNoticeFormSchema,
} from '@/schemas/create-notice-form-schema'
import { createNotice } from '@/services/create-notice'
import { uploadImage } from '@/services/upload-image'
import { useQueryClient } from '@tanstack/react-query'
import { LoaderCircleIcon, PlusIcon, UploadIcon, XIcon } from 'lucide-react'
import { useRef, useState } from 'react'

export function CreateNoticeDialog() {
  const [open, setOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateNoticeFormSchema>({
    resolver: zodResolver(createNoticeFormSchema),
    defaultValues: {
      title: '',
      content: '',
      imageId: '',
      type: 'TOAST',
      status: 'DRAFT',
      dismissible: false,
    },
  })

  function resetForm() {
    reset()
    setImagePreview(null)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImagePreview(URL.createObjectURL(file))
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const image = await uploadImage(formData)
      setValue('imageId', image.id)
    } finally {
      setIsUploading(false)
    }
  }

  async function onSubmit(data: CreateNoticeFormSchema) {
    await createNotice({ ...data, status: submitStatus })
    await queryClient.invalidateQueries({ queryKey: ['notices'] })
    resetForm()
    setOpen(false)
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={setOpen}>
      <RadixDialog.Trigger asChild>
        <button className="flex items-center gap-2 p-2 text-sm text-white bg-purple-500 rounded-lg cursor-pointer">
          <PlusIcon className="size-4" />
          Novo aviso
        </button>
      </RadixDialog.Trigger>

      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <RadixDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-zinc-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <RadixDialog.Title className="font-bold text-xl">
              Novo aviso
            </RadixDialog.Title>
            <RadixDialog.Close className="p-1 text-zinc-500 hover:text-zinc-700">
              <XIcon className="size-5" />
            </RadixDialog.Close>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-zinc-700">Título</span>
              <input
                type="text"
                className="w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-zinc-700">
                Conteúdo
              </span>
              <textarea
                rows={3}
                className="w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg resize-none"
                {...register('content')}
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700">Tipo</span>
                <select
                  className="w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg"
                  {...register('type')}
                >
                  <option value="TOAST">Toast</option>
                  <option value="MODAL">Modal</option>
                  <option value="BANNER">Banner</option>
                </select>
              </label>

              <label className="flex items-end gap-2 pb-2">
                <input
                  type="checkbox"
                  className="size-4 accent-purple-500"
                  {...register('dismissible')}
                />
                <span className="text-sm font-medium text-zinc-700">
                  Dispensável
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700">
                  Data de início
                </span>
                <input
                  type="date"
                  className="w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg"
                  {...register('startDate', { valueAsDate: true })}
                />
                {errors.startDate && (
                  <p className="text-xs text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700">
                  Data de expiração
                </span>
                <input
                  type="date"
                  className="w-full p-2 border border-zinc-200 focus:outline outline-purple-400 rounded-lg"
                  {...register('endDate', { valueAsDate: true })}
                />
                {errors.endDate && (
                  <p className="text-xs text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-zinc-700">Imagem</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border border-zinc-200"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
                      <LoaderCircleIcon className="size-6 text-purple-500 animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 w-full h-40 border border-dashed border-zinc-300 text-zinc-500 hover:border-purple-400 hover:text-purple-500 rounded-lg transition-colors cursor-pointer"
                >
                  <UploadIcon className="size-5" />
                  Selecionar imagem
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                onClick={() => setSubmitStatus('DRAFT')}
                className="flex-1 flex items-center justify-center h-10 text-sm border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting && submitStatus === 'DRAFT' ? (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                  'Salvar rascunho'
                )}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                onClick={() => setSubmitStatus('ACTIVE')}
                className="flex-1 flex items-center justify-center h-10 text-sm text-white bg-purple-500 hover:bg-purple-600 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting && submitStatus === 'ACTIVE' ? (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                  'Publicar'
                )}
              </button>
            </div>
          </form>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
