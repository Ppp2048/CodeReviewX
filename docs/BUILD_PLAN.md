# CodeReviewX Build Plan

## Phase 1: Scaffold
- Create Next.js 15 App Router project
- Add TypeScript
- Add Tailwind CSS
- Add shadcn/ui
- Add landing page
- Add login/signup pages
- Add dashboard shell
- Add settings page
- Add .env.example
- Add README setup section

## Phase 2: Supabase
- Add Supabase Auth
- Add Supabase client/server helpers
- Add SQL migrations
- Add profiles table
- Add reviews table
- Add review_files table
- Add review_issues table
- Add RLS policies
- Add settings profile save functionality

## Phase 3: GitHub PR Analyzer
- Parse GitHub PR URLs
- Fetch PR metadata
- Fetch changed files
- Support public PRs without token
- Support optional GitHub token for private/rate-limited repos
- Add validation and error handling

## Phase 4: Static Analyzer
- Detect secrets
- Detect SQL injection-looking patterns
- Detect auth/payment/config file changes
- Detect missing tests
- Detect deleted tests
- Detect large risky diffs
- Detect dependency changes
- Add risk scoring

## Phase 5: Review UI
- Build new review page
- Build reviews list page
- Build review detail page
- Show risk score
- Show file-wise risk
- Show issues by severity
- Show diff viewer

## Phase 6: AI Summary
- Add rule-based fallback summary
- Add optional OpenAI/Gemini integration
- Generate PR summary
- Generate suggested tests
- Generate reviewer checklist

## Phase 7: Export + Dashboard
- Add dashboard metrics
- Add charts
- Add recent reviews
- Add Markdown export
- Add demo review mode

## Phase 8: Testing + Deployment
- Add Vitest tests
- Add GitHub Actions
- Ensure build passes
- Add Vercel deployment instructions
- Add Supabase setup instructions
