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

## Architecture

### Routing & Auth Flow

- App Router pages live in `src/app/`. Protected routes under `/dashboard/*`.
- `src/proxy.ts` is the middleware: redirects unauthenticated users to `/login`, authenticated users away from `/login`.
- Auth API catch-all at `/api/v1/auth/[...all]` handles Better Auth routes.
- Server-side auth config in `src/lib/auth.ts`, client-side in `src/lib/auth-client.ts`.

### Database

- Drizzle schema files in `src/database/schema/` (users, notices, sessions, accounts, verifications, images).
- Migrations in `src/database/migrations/`. Config in `drizzle.config.ts`.
- DB client initialized in `src/database/index.ts`.
- Key enums: `notice_type_enum` (TOAST, MODAL, BANNER), `notices_status_enum` (DRAFT, ACTIVE, PAUSED, ARCHIVED).

### Server Actions

Located in `src/services/`. These are `'use server'` functions called from client components:
- `createNotice` — inserts notice, requires auth session
- `fetchRecentNotices` — paginated query joining notices with users
- `uploadImage` — placeholder (S3/R2 integration pending)

### Components

- `src/components/ui/` — base UI primitives (Avatar, etc.)
- `src/components/` — feature components (notice dialog, table, sidebar, header, login form)
- Providers: `QueryProvider` (TanStack Query), `SidebarProvider` (sidebar state context)

### Environment

- Env vars validated with Zod in `src/env/index.ts`. Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `RESEND_API_KEY`.
- See `.env.example` for reference.

## Conventions

- Path alias: `@/*` maps to `src/*`
- Formatting: single quotes, no semicolons, trailing commas (Prettier)
- `cn()` utility in `src/lib/utils.ts` combines clsx + tailwind-merge
- Form schemas in `src/schemas/`, HTTP response schemas in `src/http/schemas/`
- Type inference from Zod: `z.infer<typeof schema>`
- Color palette: purple (primary), zinc (neutrals), emerald/amber/red (status indicators)
