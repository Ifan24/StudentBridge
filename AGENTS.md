# StudentBridge Agent Instructions

## Project

StudentBridge is a team-built Next.js web app for international students in Australia. The app helps students discover trusted events, forum discussions, job opportunities, employer sessions, volunteering opportunities and support services.

## Team Roles

- Marketing: Chengzhi
- Back-end: Siqi
- Front-end: Johnny
- Data Analytics and Research: unassigned
- Finance: Santosh
- Project Coordination: Sabina
- AI: Ruiqi

## Product Direction

Build toward a deployable Vercel prototype, not a static report site.

Prioritise:

- student onboarding
- event discovery
- student forum discussions
- job board finding
- support-service discovery
- sponsor or partner profiles
- AI assistance for recommendations, onboarding and networking confidence

Avoid:

- personal coursework notes
- candidate-only files
- declaration forms
- assessment drafts
- private student data
- generated-agent provenance comments

## Technical Direction

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel deployment
- server-side API routes or server actions for AI calls

Keep secrets server-side. Do not expose API keys through `NEXT_PUBLIC_` variables.

Prefer simple seeded data for the prototype until the core screens are stable. When adding a database, keep the data model aligned with users, profiles, events, organisations, forum topics, forum posts, comments, job opportunities, saved items, registrations and reports.

## AI Direction

AI features should be practical and bounded:

- personalised onboarding plan
- event recommendations from known app data
- networking introduction/pitch helper
- support-service router with official links
- event tagging or sponsor quality checks

AI should not provide legal, migration, medical or financial advice. For high-stakes questions, route users to official resources.

Use structured outputs for recommendation objects when the UI expects predictable fields.

## Safety and Privacy

Design for trust from the start:

- opt-in contact or application-interest sharing
- report and block controls
- event host verification
- forum moderation and community standards
- no exact student address sharing
- private profile fields by default
- aggregated sponsor analytics only
- moderation path for reported users, events and organisations

## Git Workflow

Use conventional commit messages.

Examples:

- `feat: add onboarding flow`
- `fix: handle empty event filters`
- `docs: add app feature research`
- `chore: update project structure`

Keep commits focused. Do not mix unrelated report, research and app-code changes unless they are part of the same feature.

## Documentation

Keep team-facing documentation in `README.md`, `research/` or future `docs/` files.

Documentation should be app/product focused and useful for the team. It should not include private coursework notes or individual-only planning.
