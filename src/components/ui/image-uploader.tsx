'use client'

import { uploadImage } from '@/services/upload-image'
import {
  DownloadIcon,
  ImageOffIcon,
  LoaderCircleIcon,
  UploadIcon,
} from 'lucide-react'
import { useRef, useState } from 'react'

interface ImageUploaderProps {
  initialUrl?: string | null
  disabled?: boolean
  onUpload: (imageId: string) => void
}

export function ImageUploader({
  initialUrl,
  disabled = false,
  onUpload,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const image = await uploadImage(formData)
      onUpload(image.id)
    } finally {
      setIsUploading(false)
    }
  }

  if (disabled) {
    return (
      <div className="flex items-center justify-center gap-2 w-full h-20 border border-zinc-200 bg-zinc-50 text-zinc-400 text-sm rounded-lg">
        <ImageOffIcon className="size-4 shrink-0" />
        Tipo de aviso não compatível com imagens.
      </div>
    )
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-zinc-200">
          <img
            src={preview}
            alt="Imagem do aviso"
            className="w-full h-48 object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <LoaderCircleIcon className="size-6 text-purple-500 animate-spin" />
            </div>
          )}
          <div className="absolute bottom-2 right-2 flex gap-2">
            {initialUrl && (
              <a
                href={initialUrl}
                download
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
              >
                <DownloadIcon className="size-3.5" />
                Baixar
              </a>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
            >
              <UploadIcon className="size-3.5" />
              Trocar
            </button>
          </div>
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
    </>
  )
}
