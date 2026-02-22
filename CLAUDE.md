# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Alfinete — a hub for centralizing the creation and publication of external notices. Built for WMA Personalizados (email domain: `@wmapersonalizados.com.br`).

## Commands

```bash
bun dev              # Start dev server
bun run build        # Production build
bun run lint         # ESLint
bun run db:generate  # Generate Drizzle migrations from schema changes
bun run db:migrate   # Apply migrations to PostgreSQL
bun run db:studio    # Open Drizzle Studio (DB browser)
```

Local PostgreSQL runs via Docker (`docker compose up -d`), credentials: docker/docker, database: alfinete, port 5432.

## Tech Stack

- **Runtime/PM:** Bun
- **Framework:** Next.js 16 (App Router, React Compiler enabled)
- **Database:** PostgreSQL + Drizzle ORM (snake_case convention)
- **Auth:** Better Auth with Magic Link plugin (passwordless email via Resend)
- **Validation:** Zod 4
- **Forms:** React Hook Form + @hookform/resolvers
- **Data fetching:** TanStack React Query (client), Server Actions (server)
- **UI:** Tailwind CSS 4, Radix UI primitives, Lucide icons
- **Storage:** Cloudflare R2 (S3-compatible) via `@aws-sdk/client-s3` — client in `src/lib/storage.ts`
- **Dates:** Day.js with `utc` + `timezone` plugins, default timezone `America/Sao_Paulo` (configured in `src/lib/dayjs.ts`)

## Architecture

### Routing & Auth Flow

- App Router pages live in `src/app/`. Protected routes under `/dashboard/*`.
- `src/proxy.ts` is the middleware: redirects unauthenticated users to `/login`, authenticated users away from `/login`.
- Auth API catch-all at `/api/v1/auth/[...all]` handles Better Auth routes.
- Server-side auth config in `src/lib/auth.ts`, client-side in `src/lib/auth-client.ts`.
- Login is restricted to `@wmapersonalizados.com.br` emails (`disableSignUp: true` in Better Auth, domain check in `loginFormSchema`).

### Routes

```
/                         → redirects to /login (next.config.ts)
/login                    → public, magic-link login form
/dashboard                → protected, notices list
/dashboard/notices/new    → protected, create notice form
/dashboard/notices/[id]   → protected, edit notice form
/api/v1/auth/[...all]     → Better Auth endpoints
/api/v1/notices           → notices route handler (kept for reference)
```

### Database

- Drizzle schema files in `src/database/schema/` (users, notices, sessions, accounts, verifications, images).
- Migrations in `src/database/migrations/`. Config in `drizzle.config.ts`.
- DB client initialized in `src/database/index.ts`.
- Key enums: `notice_type_enum` (TOAST, MODAL, BANNER), `notices_status_enum` (DRAFT, ACTIVE, PAUSED, ARCHIVED).
- `notices.start_date` and `notices.end_date` are `timestamp with time zone`. Always stored as São Paulo midnight / end-of-day — see **Date handling** below.

### Server Actions

All data mutations go through `'use server'` functions in `src/services/`:

- `createNotice` — inserts notice, requires auth session, takes `EditNoticeFormSchema`
- `updateNotice` — updates notice fields, requires auth session
- `fetchRecentNotices` — paginated list (50/page) joining notices with users
- `getNotice` — fetches single notice by ID with joined image URL
- `uploadImage` — uploads file to Cloudflare R2, inserts record in `images` table, returns `{ id, url }`

### Components

- `src/components/ui/` — base primitives: `Avatar`, `Button` (variant: primary/secondary, isLoading), `LimitedInput`, `LimitedTextarea`, `ImageUploader`
- `src/components/create-notice-form.tsx` — full-page create form (`/dashboard/notices/new`)
- `src/components/edit-notice-form.tsx` — full-page edit form (`/dashboard/notices/[id]`)
- Both notice forms share `editNoticeFormSchema` and the same layout/validation rules
- Providers: `QueryProvider` (TanStack Query in dashboard layout), `SidebarProvider` (sidebar open/close state)

### Environment

Validated with Zod in `src/env/index.ts`. All required:

```
DATABASE_URL
BETTER_AUTH_SECRET
NEXT_PUBLIC_BETTER_AUTH_URL   # Must use process.env directly in client code, not @/env
RESEND_API_KEY
CLOUDFLARE_ACCOUNT_ID
AWS_BUCKET_NAME
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
R2_PUBLIC_URL
```

See `.env.example` for reference.

## Conventions

- Path alias: `@/*` maps to `src/*`
- Formatting: single quotes, no semicolons, trailing commas (Prettier)
- `cn()` utility in `src/lib/utils.ts` combines clsx + tailwind-merge
- Form schemas in `src/schemas/`, HTTP response schemas in `src/http/schemas/`
- Type inference from Zod: `z.infer<typeof schema>`
- Zod 4 error messages use `{ error: 'msg' }` format, not the string shorthand
- Color palette: purple (primary), zinc (neutrals), emerald/amber/red (status indicators)

## Business Rules

### Notice character limits by type

Enforced via `superRefine` in `editNoticeFormSchema` and exported as `typeLimits` for UI counters:

| Type   | Title | Content |
|--------|-------|---------|
| TOAST  | 30    | 70      |
| MODAL  | 80    | 350     |
| BANNER | 40    | 140     |

Images are only supported for MODAL type (`ImageUploader` renders a disabled state for other types).

### Date handling

Dates are always interpreted in the `America/Sao_Paulo` timezone (UTC-3, no DST since 2019):

- **Form inputs** produce plain strings (`"YYYY-MM-DD"`) — do NOT use `valueAsDate: true` on date inputs.
- **Server actions** (`createNotice`, `updateNotice`) convert to `Date` with explicit offset:
  ```ts
  startDate: new Date(data.startDate + 'T00:00:00-03:00')
  endDate:   new Date(data.endDate   + 'T23:59:59-03:00')
  ```
- **Edit form defaults** extract the SP date from stored timestamps using dayjs:
  ```ts
  dayjs(notice.startDate).tz('America/Sao_Paulo').format('YYYY-MM-DD')
  ```
- **Display** uses `dayjs(date).format('ll')` — the configured default timezone ensures SP-local dates in the UI.
