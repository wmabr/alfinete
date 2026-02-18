'use server'

import { db } from '@/database'
import { images } from '@/database/schema'

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File | null

  if (!file) {
    throw new Error('No file provided')
  }

  // TODO: replace with real storage provider (S3, R2, etc.)
  // Upload the file to your storage and get back the public URL.
  const url = `https://placeholder.local/uploads/${file.name}`

  const [image] = await db
    .insert(images)
    .values({ url })
    .returning({ id: images.id, url: images.url })

  return image
}
