# CodeReviewX Deployment Plan

## Free Deployment Stack

- Frontend/backend: Vercel
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase if needed
- GitHub integration: GitHub REST API
- AI: Optional user-provided OpenAI/Gemini key

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=
GEMINI_API_KEY=
