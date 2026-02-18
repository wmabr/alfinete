'use server'

import { db } from '@/database'
import { notices } from '@/database/schema'
import { auth } from '@/lib/auth'
import { CreateNoticeFormSchema } from '@/schemas/create-notice-form-schema'
import { headers } from 'next/headers'

export async function createNotice(data: CreateNoticeFormSchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error('Unauthorized')
  }

  const [notice] = await db
    .insert(notices)
    .values({
      authorId: session.user.id,
      title: data.title,
      content: data.content,
      imageId: data.imageId || null,
      type: data.type,
      status: data.status,
      dismissible: data.dismissible,
      startDate: data.startDate,
      endDate: data.endDate,
    })
    .returning({ id: notices.id })

  return notice
}
