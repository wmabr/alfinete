import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const images = pgTable('images', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
