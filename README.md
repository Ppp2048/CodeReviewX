# CodeReviewX

CodeReviewX is an AI-assisted pull request review workspace for fast risk triage, explainable static analysis, optional server-side AI summaries, and exportable review reports. The stack is designed to deploy cleanly on Vercel with Supabase on free or low-cost tiers.

## Features

- Supabase authentication with protected dashboard routes
- GitHub PR URL analysis with optional token support
- Pasted unified diff analysis
- Rule-based static analyzer with per-file and overall risk scoring
- Optional OpenAI or Gemini summary generation with safe fallback
- Saved review reports with file risks, issue grouping, inline diff viewing, and Markdown export
- Dashboard metrics, recent reviews, common issue categories, and Recharts trends
- Demo review mode using local fixtures

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL
- Recharts
- Vitest
- ESLint
- GitHub Actions

## Architecture

```text
Browser UI
  -> Next.js App Router
    -> Server actions / API routes
      -> GitHub REST API
      -> Rule-based analyzer
      -> Optional OpenAI / Gemini provider
      -> Supabase Auth + Postgres
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

3. Fill in the values in `.env.local`.

4. Start the development server.

   ```powershell
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

1. Create a Supabase project.
2. Copy the project URL to `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the publishable key to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Copy the service role key to `SUPABASE_SERVICE_ROLE_KEY`.
5. In Supabase Auth, add:
   - `http://localhost:3000`
   - your Vercel production URL
6. Run the SQL migration from [supabase/migrations/20260507163000_phase2_auth_schema.sql](C:\Users\KIIT0001\Desktop\Projects\CodeReviewX\supabase\migrations\20260507163000_phase2_auth_schema.sql).

## Environment Variables

Use the following values locally and in Vercel:

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
- AI keys are used only on the server.
- GitHub tokens entered in the app are not stored.

## Testing Checklist

Run these commands before deployment:

```powershell
npm run lint
npm test
npm run build
```

Checklist:

- `npm run lint` passes
- `npm test` passes
- `npm run build` passes
- Supabase redirect URLs are configured
- `.env.local` is ignored and no secrets are committed
- demo review mode works
- Markdown export works from a saved review

## Demo Workflow

1. Sign in to the app.
2. Open `/dashboard/new-review`.
3. Choose one of:
   - a live GitHub PR URL
   - a pasted unified diff
   - the demo review mode card
4. Wait for the report to save and redirect.
5. Inspect file risks, issue groups, summary sections, and diff viewer.
6. Export the report as Markdown from the review detail page.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add all environment variables from `.env.example`.
4. Ensure `NEXT_PUBLIC_APP_URL` matches the deployed URL.
5. Ensure Supabase Auth redirect URLs include the Vercel domain.
6. Deploy.
7. After the first deploy, sign in and verify:
   - dashboard loads
   - new review flow works
   - export route works
   - AI fallback works if no provider key is set

## CI

GitHub Actions workflow: [.github/workflows/ci.yml](C:\Users\KIIT0001\Desktop\Projects\CodeReviewX\.github\workflows\ci.yml)

The workflow runs:

- dependency install
- lint
- Vitest
- production build

## Screenshots Placeholder

Add screenshots here later:

- `docs/screenshots/landing-page.png`
- `docs/screenshots/dashboard-overview.png`
- `docs/screenshots/new-review.png`
- `docs/screenshots/review-detail.png`

## CV Bullet

- Built CodeReviewX, a deployable AI-assisted pull request review platform with Next.js, Supabase, explainable static analysis, optional OpenAI/Gemini summaries, GitHub Actions CI, dashboard analytics, demo mode, and Markdown-exportable review reports.

## Future Improvements

- GitHub OAuth and repository linking
- GitHub review comment publishing
- Tree-sitter or AST-driven analysis
- SARIF export
- GitHub Actions repository integration
- Organization and team dashboards
