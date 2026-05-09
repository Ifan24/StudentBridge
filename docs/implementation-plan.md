# StudentBridge MVP Implementation Plan

## Summary

Build StudentBridge as a deployable Next.js App Router app with NeonDB/Postgres, Prisma and Gemini. The MVP helps international students discover events, use a moderated student forum, find job opportunities, access official support and use AI guidance.

Profitability uses a student subscription model, not sponsor advertising. Core safety and support features stay free. Premium plans unlock higher AI usage and productivity tools for job search, networking and weekly planning.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- NeonDB/Postgres
- Gemini API
- Vercel deployment

## MVP Routes

- `/dashboard` - personalised student home and next actions
- `/onboarding` - profile setup saved through Prisma
- `/events` - City of Sydney What’s On event feed, normalized and cached
- `/forum` - Reddit-like student forum with topics, posts, replies, votes, saved posts and reports
- `/jobs` - mock job board from seeded database data
- `/support` - official support resources plus AI support router
- `/ai` - Gemini-powered StudentBridge AI Guide
- `/subscription` - Free, Plus and Pro subscription plans with AI usage limits

## Data Model

- `User`
- `StudentProfile`
- `ForumTopic`
- `ForumPost`
- `ForumComment`
- `ForumVote`
- `JobOpportunity`
- `SupportResource`
- `SubscriptionPlan`
- `UserSubscription`
- `SavedItem`
- `EventCache`
- `Report`
- `AiInteraction`

## Subscription Model

- Free: events, forum, jobs, support resources and 5 AI Guide uses per month.
- Plus: higher AI usage, job alerts, saved folders and weekly plans.
- Pro: heavier AI coaching for resumes, introductions, interviews and job-fit reasoning.

MVP subscription actions are simulated. No real payment processor is included yet.

## AI Rules

- Gemini runs only server-side using `GEMINI_API_KEY`.
- `GEMINI_MODEL` defaults to `gemini-2.5-flash`.
- AI outputs should be structured JSON cards.
- AI usage is limited by active subscription plan.
- AI must route legal, migration, medical and financial topics to official resources rather than answering as final advice.

## Event Integration

- `GET /api/events` fetches City of Sydney What’s On pages.
- It parses `__NEXT_DATA__.props.pageProps.searchResults.hits`.
- Results are normalized into StudentBridge event rows.
- Event results are cached in `EventCache` for 1 hour when Neon is available.
- Fallback events are shown if the source is unavailable.

## Testing

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm prisma validate`
- `pnpm prisma db seed` with real Neon credentials

Browser QA should cover onboarding persistence, forum create/reply/vote/report, job filters, events fallback, subscription plan switching and AI usage-limit behavior.
