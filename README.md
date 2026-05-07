# CodeReviewX

CodeReviewX is an AI-assisted pull request review workspace built for fast triage, structured review workflows, and clear risk visibility. This repository currently includes the Phase 1 product scaffold: a polished Next.js dashboard shell, auth entry points, and a settings experience ready for later Supabase, GitHub, and AI integrations.

## Phase 1 Scope

- Next.js App Router scaffold with TypeScript
- Tailwind CSS setup
- shadcn-style UI component foundation
- Dark SaaS landing page
- Login page
- Signup page
- Dashboard shell
- Settings page
- Placeholder review routes for future phases
- Environment template

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
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

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values when Phase 2 integrations begin.

## Phase 2 and Beyond

The following are intentionally not implemented yet:

- Supabase auth wiring and database tables
- GitHub PR ingestion and analysis
- AI summaries and export flows
- Review persistence

## Deployment Notes

The scaffold is designed for Vercel deployment once runtime integrations are added in later phases.
