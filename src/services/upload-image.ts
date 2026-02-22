'use server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { db } from '@/database'
import { images } from '@/database/schema'
import { env } from '@/env'
import { r2 } from '@/lib/storage'

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File | null

  if (!file) {
    throw new Error('No file provided')
  }

  const ext = file.name.split('.').pop()
  const key = `${crypto.randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  await r2.send(
    new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  )

  const url = `${env.R2_PUBLIC_URL}/${key}`

  const [image] = await db
    .insert(images)
    .values({ url })
    .returning({ id: images.id, url: images.url })

  return image
}
