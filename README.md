# CodeReviewX

CodeReviewX is an AI-assisted pull request review workspace for fast risk triage, explainable static analysis, saved review reports, and reviewer-ready summaries. The app is built as a free-tier friendly SaaS stack with Next.js, Supabase, and optional server-side AI providers.

## Features

- Supabase email/password auth with protected dashboard routes
- GitHub PR URL analysis with optional token support
- Pasted unified diff analysis
- Rule-based static analyzer with risk scoring
- Optional OpenAI or Gemini review summaries with safe rule-based fallback
- Saved review history with file-level risk, issue grouping, and diff inspection
- Dashboard metrics, recent review activity, common issue categories, and trend charts
- Demo review mode backed by local fixtures
- Markdown export for saved review reports

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Supabase PostgreSQL
- Recharts
- Vitest
- ESLint

## Architecture

```text
User
  -> Next.js App Router UI
    -> Server actions / route handlers
      -> GitHub REST API (optional live PR source)
      -> Rule-based analyzer
      -> Optional OpenAI / Gemini provider
      -> Supabase Auth + Postgres storage
```

## Project Structure

```text
app/
  api/
  dashboard/
  login/
  settings/
  signup/
components/
  dashboard/
  review/
  ui/
fixtures/
lib/
  ai/
  analyzer/
  export/
  github/
  reviews/
  supabase/
supabase/
  migrations/
tests/
```

## Local Setup

1. Install dependencies.

   ```powershell
   npm install
   ```

2. Copy the environment template.

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Fill in the required variables in `.env.local`.

4. Start the app.

   ```powershell
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Add these values to `.env.local` for local development and to Vercel for deployment:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GITHUB_APP_CLIENT_ID=
GITHUB_APP_CLIENT_SECRET=
OPENAI_API_KEY=
GEMINI_API_KEY=
```

Notes:

- `OPENAI_API_KEY` and `GEMINI_API_KEY` are optional.
- AI provider calls happen only on the server.
- GitHub personal access tokens entered in the UI are used for that request only and are not stored.

## Supabase Setup

1. Create a Supabase project.
2. Copy the project URL into `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the publishable key into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Copy the service role key into `SUPABASE_SERVICE_ROLE_KEY`.
5. Configure the site URL and local redirect URL in Supabase Auth settings.
6. Run the SQL migration in [supabase/migrations/20260507163000_phase2_auth_schema.sql](C:\Users\KIIT0001\Desktop\Projects\CodeReviewX\supabase\migrations\20260507163000_phase2_auth_schema.sql).

## Database Migration

Use the Supabase SQL editor and run:

```sql
-- paste the contents of:
-- supabase/migrations/20260507163000_phase2_auth_schema.sql
```

That migration creates:

- `profiles`
- `reviews`
- `review_files`
- `review_issues`
- Row Level Security policies for user-owned access

## Demo Workflow

1. Sign in.
2. Open `/dashboard/new-review`.
3. Use either:
   - a live GitHub PR URL
   - a pasted unified diff
   - the demo review mode card
4. Open the saved report.
5. Export the report as Markdown if needed.

## Dashboard and Reporting

Phase 7 adds:

- total review count
- high-risk review count
- average risk score
- reviews needing attention
- recent review list
- common analyzer issue categories
- Recharts-based dashboard trends
- Markdown export route at `/api/export/[id]`
- demo review seeding from local fixtures

## AI Summary Behavior

- `None`: always uses deterministic rule-based summary generation
- `OpenAI`: uses `OPENAI_API_KEY` when present, otherwise falls back
- `Gemini`: uses `GEMINI_API_KEY` when present, otherwise falls back

Generated sections include:

- PR summary
- key risks
- suggested tests
- reviewer checklist

## Testing

Run the checks below:

```powershell
npm run lint
npm test
npm run build
```

The current test suite covers:

- GitHub PR URL parsing
- static analyzer rules
- risk scoring
- AI summary serialization

## Deployment Notes

Deploy on Vercel with the same environment variables used locally.

Recommended steps:

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add all environment variables in Vercel project settings.
4. Ensure Supabase Auth redirect URLs include the Vercel domain.
5. Deploy.

## Screenshots Placeholder

Add product screenshots here later:

- `docs/screenshots/landing-page.png`
- `docs/screenshots/new-review.png`
- `docs/screenshots/review-report.png`
- `docs/screenshots/dashboard-overview.png`

## CV Bullet

- Built CodeReviewX, an AI-assisted pull request review platform with Next.js, Supabase, explainable static analysis, optional OpenAI/Gemini summaries, saved Markdown-exportable reports, and a chart-driven SaaS dashboard.

## Future Improvements

- GitHub OAuth and repository linking
- GitHub review comment publishing
- Tree-sitter or AST-driven deeper analysis
- SARIF export
- GitHub Actions integration
- organization and team dashboards
