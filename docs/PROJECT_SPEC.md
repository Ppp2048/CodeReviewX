You are an expert full-stack engineer. Build a complete deployable project called CodeReviewX.

Project summary:
CodeReviewX is an AI-assisted pull request review and static analysis platform. A user can sign in, connect their GitHub profile, paste a GitHub pull request URL or upload a .diff file, and receive a review report showing file-wise risk scores, detected issues, AI summary, suggested tests, and an exportable report.

The project must be deployable on free platforms:
- Next.js App Router + TypeScript deployed on Vercel
- Supabase PostgreSQL for database
- Supabase Auth for authentication
- Tailwind CSS + shadcn/ui for UI
- Optional user-provided AI API key for AI summaries
- No paid infrastructure
- No Docker dependency required for deployment

Use this tech stack:
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- Supabase SSR helpers
- Recharts for dashboard charts
- Vitest for unit tests
- Playwright for basic e2e tests if feasible
- ESLint + Prettier

Core pages:
1. Landing page at /
2. Auth pages:
   - /login
   - /signup
3. Dashboard:
   - /dashboard
   - /dashboard/new-review
   - /dashboard/reviews
   - /dashboard/reviews/[id]
   - /settings

Main features:
1. User authentication with Supabase Auth.
2. User profile/settings page with fields:
   - full name
   - GitHub username
   - GitHub profile URL
   - default repo owner
   - default repo name
   - preferred AI provider: none/openai/gemini
   - optional user AI API key field; do not store this in plaintext unless clearly marked as demo-only. Prefer session-only local storage for MVP.
3. New review page:
   - Input mode selector: GitHub PR URL OR paste/upload diff
   - GitHub PR URL input
   - Optional GitHub Personal Access Token input for private repos or rate-limit handling; do not store token in DB for MVP
   - Diff text area
   - Analyze button
4. GitHub PR analyzer:
   - Parse PR URL format: https://github.com/{owner}/{repo}/pull/{number}
   - Fetch PR metadata using GitHub REST API
   - Fetch PR changed files from GitHub REST API
   - Use optional Authorization header if token is provided
   - Support public PRs without token
   - Handle errors clearly: invalid URL, rate limit, private repo, PR not found
5. Diff analyzer:
   - Accept pasted .diff text
   - Parse files and patches as best effort
6. Static analysis engine:
   Implement rule-based checks:
   - secret exposure
   - SQL injection-looking patterns
   - sensitive auth/payment/config file changes
   - no tests added when sensitive files changed
   - deleted tests
   - large risky diff
   - package/dependency changes
   - dangerous JavaScript/TypeScript patterns such as eval(), dangerouslySetInnerHTML, child_process.exec with variable input
7. Risk scoring:
   - Each issue has severity: low/medium/high/critical
   - low = 10 points, medium = 25, high = 50, critical = 80
   - File risk score is capped at 100
   - Overall risk score is weighted average plus critical issue boost, capped at 100
   - Risk level:
     0-24 low
     25-49 medium
     50-74 high
     75-100 critical
8. AI summary:
   - If AI provider is none or no key is provided, generate a deterministic rule-based summary.
   - If OpenAI/Gemini key is provided, call the provider from a server route only.
   - Never expose AI API keys to the client.
   - Generate:
     - PR summary
     - key risks
     - suggested test cases
     - reviewer checklist
9. Review storage:
   Store review result in Supabase:
   - reviews
   - review_files
   - review_issues
10. Review detail page:
   Show:
   - PR title, repo, author, PR URL
   - overall risk score
   - risk level badge
   - AI/rule summary
   - suggested tests
   - file list with risk scores
   - issues grouped by severity
   - patch/diff viewer per file
   - export as Markdown button
11. Dashboard:
   Show:
   - total reviews
   - high-risk reviews
   - average risk score
   - common issue categories
   - recent reviews
   - chart of reviews over time
12. Export:
   - Export review report as Markdown
   - Include summary, risk score, file risks, issues, and suggested tests
13. Testing:
   - Unit tests for PR URL parser
   - Unit tests for static analysis rules
   - Unit tests for risk scoring
   - Unit tests for diff parser
   - Add a few sample fixtures
14. Seed/demo data:
   - Add sample diff files in /fixtures
   - Add a demo review mode so the app can be shown without GitHub token
15. Deployment:
   - Add README.md with setup instructions
   - Add .env.example
   - Add Supabase SQL migration files
   - Add Vercel deployment instructions
   - Add screenshots placeholder section
   - Add CV bullet section

Database schema:
Create Supabase SQL migration with these tables:

profiles:
- id uuid primary key references auth.users(id) on delete cascade
- full_name text
- github_username text
- github_profile_url text
- default_repo_owner text
- default_repo_name text
- preferred_ai_provider text default 'none'
- created_at timestamptz default now()
- updated_at timestamptz default now()

reviews:
- id uuid primary key default gen_random_uuid()
- user_id uuid references auth.users(id) on delete cascade not null
- source_type text not null check source_type in github_pr/diff_upload
- pr_url text
- repo_owner text
- repo_name text
- pr_number int
- title text
- author text
- overall_risk_score int default 0
- risk_level text default 'low'
- ai_summary text
- suggested_tests text
- raw_diff text
- created_at timestamptz default now()

review_files:
- id uuid primary key default gen_random_uuid()
- review_id uuid references reviews(id) on delete cascade not null
- file_path text not null
- status text
- additions int default 0
- deletions int default 0
- patch text
- risk_score int default 0
- risk_level text default 'low'
- created_at timestamptz default now()

review_issues:
- id uuid primary key default gen_random_uuid()
- review_id uuid references reviews(id) on delete cascade not null
- file_id uuid references review_files(id) on delete cascade
- severity text not null check severity in low/medium/high/critical
- category text not null
- title text not null
- description text
- recommendation text
- line_number int
- created_at timestamptz default now()

Enable Row Level Security:
- profiles: users can select/insert/update own profile
- reviews: users can select/insert/delete own reviews
- review_files: users can select/insert/delete only files belonging to their own reviews
- review_issues: users can select/insert/delete only issues belonging to their own reviews

Environment variables:
Create .env.example with:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_APP_CLIENT_ID=
GITHUB_APP_CLIENT_SECRET=
OPENAI_API_KEY=
GEMINI_API_KEY=

Important security constraints:
- Do not commit .env files.
- Do not expose service role key to browser.
- Do not expose GitHub token or AI key to browser.
- For MVP, GitHub token should be used only in the server route request and not persisted.
- Use Supabase RLS.
- Validate all input with zod.
- Rate-limit analyze endpoint lightly in code if possible.

Suggested file structure:
app/
  page.tsx
  login/page.tsx
  signup/page.tsx
  dashboard/page.tsx
  dashboard/new-review/page.tsx
  dashboard/reviews/page.tsx
  dashboard/reviews/[id]/page.tsx
  settings/page.tsx
  api/analyze/github-pr/route.ts
  api/analyze/diff/route.ts
  api/export/[id]/route.ts
components/
  layout/
  auth/
  dashboard/
  review/
  ui/
lib/
  supabase/
  github/
  analyzer/
  ai/
  db/
  utils/
tests/
  analyzer/
  github/
  risk/
supabase/
  migrations/
fixtures/

Implementation details:
- Use server actions or route handlers for sensitive operations.
- Use zod validation for API inputs.
- Use TypeScript types for Review, ReviewFile, ReviewIssue.
- Create lib/github/parse-pr-url.ts.
- Create lib/github/fetch-pr-files.ts.
- Create lib/analyzer/rules.ts.
- Create lib/analyzer/risk-score.ts.
- Create lib/analyzer/diff-parser.ts.
- Create lib/ai/summary.ts.
- Create lib/export/markdown.ts.

UI requirements:
- Clean, modern SaaS dashboard.
- Dark mode by default.
- Cards for metrics.
- Risk badges with colors:
  low = green
  medium = yellow
  high = orange
  critical = red
- File risk table.
- Issues grouped by severity.
- Diff viewer panel.
- Empty states and loading states.
- Error states for invalid GitHub URL or API failure.

README must include:
1. Project description
2. Features
3. Tech stack
4. Architecture diagram in text form
5. Local setup
6. Supabase setup
7. Database migration instructions
8. Environment variable setup
9. How to run tests
10. How to deploy on Vercel
11. Demo workflow
12. CV bullet
13. Future improvements:
    - GitHub OAuth
    - GitHub review comments
    - Tree-sitter AST analysis
    - SARIF export
    - GitHub Actions integration
    - Organization/team dashboard

Build the project incrementally:
Phase 1:
- Create Next.js app structure
- Supabase auth
- Landing, dashboard, settings

Phase 2:
- GitHub PR URL parser
- Fetch PR files
- Static analyzer
- Risk scoring

Phase 3:
- Store reviews in Supabase
- Review detail page
- Dashboard metrics

Phase 4:
- AI summary
- Export report
- Tests
- README
- Deployment polish

After implementation, provide:
- exact terminal commands to run locally
- SQL to run in Supabase
- environment variables to add in Vercel
- deployment steps
- testing checklist
