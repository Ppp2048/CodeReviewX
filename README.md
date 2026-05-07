# CodeReviewX

CodeReviewX is an AI-assisted pull request review workspace built for fast triage, structured review workflows, and clear risk visibility. This repository currently includes the Phase 1 scaffold plus Phase 2 Supabase foundations: authentication, protected routes, profile persistence, and schema migrations.

## Current Scope

- Next.js App Router scaffold with TypeScript
- Tailwind CSS setup
- shadcn-style UI component foundation
- Dark SaaS landing page
- Login page
- Signup page
- Dashboard shell
- Supabase Auth wiring
- Browser and server Supabase clients
- Protected dashboard and settings routes
- Settings page profile save
- GitHub PR URL parser and API fetch foundation
- GitHub changed-files fetcher with optional token support
- SQL migrations and RLS policies
- Placeholder review routes for future phases
- Environment template

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase SSR helpers
- Supabase PostgreSQL migrations
- Vitest
- ESLint

## Folder Structure

```text
app/
components/
lib/
public/
```

## Local Setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Start the development server:

   ```powershell
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

4. Run the parser unit tests:

   ```powershell
   npm test
   ```

## Environment Variables

Copy `.env.example` to `.env.local` and add your Supabase project credentials.

## Supabase Setup

1. Create a Supabase project.
2. In Supabase, copy:
   - `Project URL` into `NEXT_PUBLIC_SUPABASE_URL`
   - `Publishable key` into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Add the `Service role key` to `SUPABASE_SERVICE_ROLE_KEY` for future server-only tasks. Phase 2 does not expose it to the browser.
4. In the Supabase SQL editor, run the migration in [supabase/migrations/20260507163000_phase2_auth_schema.sql](supabase/migrations/20260507163000_phase2_auth_schema.sql)
   or apply it with the Supabase CLI if you use one.
5. In Authentication settings, configure your site URL and any local redirect URLs you need, such as `http://localhost:3000`.

## What Phase 2 Adds

- Supabase email/password auth
- Middleware-based route protection for `/dashboard` and `/settings`
- Profile persistence for the settings page
- SQL schema for `profiles`, `reviews`, `review_files`, and `review_issues`
- Row Level Security policies for user-owned data

## What Phase 3 Adds

- GitHub pull request URL parsing
- GitHub PR metadata fetcher
- GitHub changed-files fetcher
- API route at `app/api/analyze/github-pr/route.ts`
- Optional GitHub token support for private repositories and rate-limit recovery
- Parser unit tests and sample GitHub response fixtures

## Still Deferred

The following are intentionally not implemented yet:

- Static analyzer and risk scoring
- AI summaries and export flows
- Review ingestion and persistence UI

## Deployment Notes

The scaffold is designed for Vercel deployment once runtime integrations are added in later phases.
