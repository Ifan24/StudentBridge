# StudentBridge App Feature Research

StudentBridge is a Next.js web app for international students in Australia. The product goal is to help students build trusted social, academic, career and community networks after arriving in Australia.

## Product Thesis

International students do not only need information. They need trusted connections and practical pathways: classmates, local events, peer discussions, support hubs, employers, job opportunities and community groups. StudentBridge should become a practical networking layer that helps students find the right people, events, discussions, opportunities and services at the right stage of their student journey.

## Evidence Summary

- Australia has a large, diverse international student market. The Australian Department of Education reported 551,717 international students studying in Australia in January 2026, with 58% from China, India, Nepal, Vietnam and Bangladesh.
- QILT's 2024 international student findings show strong overall living satisfaction, but work experience in the field of study was the weakest living-experience area.
- Study Australia's 2024 Student Survey found that only 17% of international students surveyed had used local state or territory support services or study hubs, while students who used them reported 92% satisfaction.
- Study Australia's Industry Experience Program demonstrates demand for structured ways to connect students with employers through real industry projects.
- Study Melbourne highlights local hubs, clubs, sport, interest groups and events as practical ways for students to build community and skills.
- eSafety's Safety by Design guidance is relevant because StudentBridge involves user profiles, listings, events, forum posts and messaging.
- OAIC Australian Privacy Principles are relevant because the app may collect personal information such as name, city, institution, interests, career field and event activity.

## Target Users

### New Arrival

Needs:

- Orientation support
- Friends and social confidence
- Local events
- Safe places to ask questions
- Basic Australian workplace and community context

StudentBridge value:

- Onboarding checklist
- Local event and forum suggestions
- Events near campus
- AI settlement guide
- Support-service discovery

### Career Builder

Needs:

- Employer events
- Job boards and employer opportunities
- Internship or volunteering opportunities
- Resume and LinkedIn guidance
- Australian workplace communication help

StudentBridge value:

- Career networking feed
- AI profile and pitch coach
- Job board finding
- Verified employer sessions
- Industry project listings

### Community Connector

Needs:

- Peer questions and answers
- Study and city discussion spaces
- Volunteering
- Sport and interest events
- Local student tips and recommendations

StudentBridge value:

- Reddit-like student forum
- Volunteer opportunity directory
- Topic feeds by interest, city and study area
- Saved posts, replies and event reminders

### Premium Subscriber

Examples:

- Students actively searching for work
- Students who want more AI coaching
- Students who need structured weekly plans
- Students preparing for networking or interviews

StudentBridge value:

- More AI usage for plans, pitches and job-fit explanations
- Saved job folders and alerts
- Resume, LinkedIn and networking intro coaching
- Weekly progress plan based on events, forum threads and jobs

## MVP Feature Set

These seven features would make the prototype feel useful without becoming too large.

First-pass concept backups are stored in `assets/concepts/generated-v1/`. They are useful for feature inventory, but the stronger visual direction should follow `design/style-direction.md`.

### 1. Student Onboarding

Concept backup: `../assets/concepts/generated-v1/01-student-onboarding.png`

Purpose:

- Understand the student's city, institution, language preferences, study area, interests and goals.

Core fields:

- City
- Campus or institution
- Study area
- Arrival stage
- Goals: make friends, find work, join forum topics, find job opportunities, volunteer, get support
- Preferred event types
- Languages

AI opportunity:

- Generate a short personalised starter plan after onboarding.

### 2. Networking Event Directory

Concept backup: `../assets/concepts/generated-v1/02-event-directory.png`

Purpose:

- Let students find practical social, academic, career and community events.

Filters:

- City
- Online or in person
- Free or paid
- Career field
- Social, career, club, volunteering, support, workshop
- Language support

Important UI states:

- Featured events
- Near me
- This week
- Saved events
- Event detail page
- Register interest

### 3. Student Forum

Concept backup: `../assets/concepts/generated-v1/03-student-forum.png`

Purpose:

- Give international students a safe Reddit-like space to ask questions, share tips and discuss student life in Australia.

MVP version:

- Topic feeds for city life, study help, jobs, events, accommodation, wellbeing and general questions.
- Posts with title, body, topic, city, tags, vote count, reply count and saved state.
- Comments/replies with simple threading for one level of discussion.
- Sort by trending, newest and unanswered.
- Let students save posts and follow topics.

Safety:

- Require clear community standards before posting.
- Allow report, hide and block actions on posts and comments.
- Avoid showing private profile details by default.
- Flag high-risk topics such as migration, legal, medical or financial questions and route users to official resources.

### 4. Job Board Finding

Concept backup: `../assets/concepts/generated-v1/04-job-board-finding.png`

Purpose:

- Help students find trusted job, internship, volunteering and industry-experience opportunities relevant to international students.

MVP version:

- Use curated listings and simple filters instead of complex real-time matching.
- Filter by city, work type, study area, industry, experience level, visa/work-rights relevance and availability.
- Let students save opportunities, view employer context and open a clear apply/contact path.

Safety:

- Students choose when to share application interest or contact details.
- Students control what profile information is visible to employers.
- No exact address sharing.
- Report/block controls.

### 5. AI StudentBridge Assistant

Concept backup: `../assets/concepts/generated-v1/05-ai-assistant.png`

Purpose:

- Give students fast, friendly guidance across the app.

MVP AI features:

- Explain what kind of networking event fits the student's goal.
- Suggest events or forum discussions from app data.
- Draft a short networking introduction message.
- Improve a LinkedIn/about-me paragraph.
- Convert student goals into a weekly action plan.
- Summarise official support resources in simple language.

Implementation notes:

- Use app-owned data first, then external links.
- Keep AI outputs structured where possible.
- Use server-side API routes/actions so API keys stay private.
- Avoid making legal, migration or medical claims. Link to official sources instead.

### 6. Support-Service Discovery

Concept backup: `../assets/concepts/generated-v1/06-support-discovery.png`

Purpose:

- Bridge the gap between available support and student awareness.

Categories:

- Study hubs
- City/state support services
- Accommodation help
- Work rights and Fair Work resources
- Emergency and safety resources
- Mental health and wellbeing links

AI opportunity:

- Ask a few questions and route the student to the right official support category.

### 7. Premium Subscription

Purpose:

- Create a student-paid revenue model without selling access to student attention or data.

MVP plan tiers:

- Free: events, forum, jobs, support resources and 5 AI guide uses per month.
- Plus: higher AI usage, job alerts, saved folders and weekly plans.
- Pro: heavier AI coaching for resumes, introductions, interview preparation and job-fit reasoning.

MVP subscription actions:

- View plan comparison.
- Simulate upgrading or downgrading the demo account.
- Show AI usage remaining for the month.
- Gate premium AI actions behind the selected plan.

## AI Feature Roadmap

Ruiqi's AI ownership can focus on features that make the app feel smarter without requiring a huge data platform on day one.

### MVP AI

1. AI onboarding plan
   - Input: city, goals, interests, study area, arrival stage
   - Output: 3 to 5 recommended first actions

2. AI event recommender
   - Input: student profile and available event data
   - Output: ranked event suggestions with short reasons

3. AI networking pitch coach
   - Input: student's rough introduction
   - Output: polished introduction for job, employer or forum context

4. AI support router
   - Input: student question
   - Output: suggested support category and official link

### Later AI

1. Multilingual event summaries
2. Smart job/opportunity recommendation explanation
3. Premium job-search quality checker
4. AI-generated event tags from event descriptions
5. AI forum post summariser and duplicate-question detector
6. Weekly networking plan
7. Subscription usage and retention summary

## Safety and Privacy Requirements

StudentBridge has social-networking elements, so safety should be part of the product from the start.

Minimum safety features:

- User reporting
- Block/mute controls
- Event host verification
- No exact address sharing in student profiles
- Opt-in messaging or application-interest sharing
- Clear community standards
- Moderation queue for reported users, posts, comments and events

Privacy principles:

- Collect only what is needed for recommendations, saved items, forum participation and application-interest workflows.
- Keep private profile details off public pages.
- Do not expose personal student data to advertisers, data brokers or employers.
- Use subscription analytics only for product usage and plan health.
- Keep API secrets server-side.
- Do not put private keys in `NEXT_PUBLIC_` environment variables.

## Suggested Data Model

Core entities:

- `User`
- `StudentProfile`
- `EventCache`
- `ForumTopic`
- `ForumPost`
- `ForumComment`
- `JobOpportunity`
- `SupportResource`
- `SubscriptionPlan`
- `UserSubscription`
- `SavedItem`
- `AiInteraction`
- `Report`
- `AiRecommendation`

Important relationships:

- A user has one student profile.
- Event data is cached from City of Sydney and refreshed on a short TTL.
- A student can save events, jobs, forum posts and support resources.
- A forum topic can have many posts.
- A post belongs to a user and can have many comments.
- A job opportunity can be saved or opened by many students.
- A user has one active subscription tier in the MVP.
- Reports can target forum posts, comments, jobs, events or support resources.

## Role Map

- Marketing - Chengzhi: brand, launch copy, user acquisition, premium positioning.
- Back-end - Siqi: database, API routes, authentication, subscription/event data.
- Front-end - Johnny: Next.js UI, responsive screens, components, interaction states.
- Data Analytics and Research: market evidence, feature validation, survey analysis, metrics.
- Finance - Santosh: subscription pricing, revenue assumptions, cost model.
- Project Coordination - Sabina: scope, timeline, task tracking, presentation flow.
- AI - Ruiqi: AI assistant, recommendations, structured outputs, AI safety and prompt design.

## Next.js and Vercel Build Notes

Recommended stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel deployment
- Server-side AI calls
- Environment variables managed in Vercel

Suggested routes:

- `/` - landing and product summary
- `/onboarding` - student onboarding
- `/dashboard` - personalised student home
- `/events` - event directory
- `/events/[id]` - event details
- `/forum` - student forum
- `/jobs` - job board finding
- `/support` - support-service directory
- `/ai` - StudentBridge assistant
- `/subscription` - premium plans and AI usage

Prototype data approach:

- Start with seeded local data in TypeScript files or JSON.
- Move to a database when the main screens are stable.
- Keep AI recommendations based on known app data first.

## MVP Success Metrics

Student metrics:

- Onboarding completion rate
- Saved events per user
- Event registration clicks
- Forum posts and helpful replies
- Job save/apply clicks
- Support-service clicks
- Repeat weekly visits

Subscription metrics:

- Free to paid conversion
- AI usage per plan
- Upgrade and downgrade clicks
- Weekly active premium users
- Churn-risk signals such as no AI use after upgrade

AI metrics:

- AI recommendation click-through
- Helpful/unhelpful feedback
- Prompt refusal/error rate
- Number of support-router answers that link to official sources

## Source Links

- Australian Department of Education, International student monthly summary and data tables: https://www.education.gov.au/international-education-data-and-research/international-student-monthly-summary-and-data-tables
- QILT, 2024 Student Experience Survey - International Key Findings: https://qilt.edu.au/docs/default-source/default-document-library/2024-ses-international-key-findings.pdf
- Study Australia, 2024 Student Survey results: https://www.studyaustralia.gov.au/en/life-in-australia/student-support-services/international-student-sentiment-survey
- Study Australia, Industry Experience Program: https://www.studyaustralia.gov.au/en/work-in-australia/getting-work-and-industry-experience/study-australia-industry-experience-program-saiep
- Study Australia, What employers are looking for: https://www.studyaustralia.gov.au/en/tools-and-resources/tips-and-advice-for-students/what-employers-are-looking-for
- Study Australia, Volunteer and industry experience: https://www.studyaustralia.gov.au/en/work-in-australia/getting-work-and-industry-experience.html
- Study Melbourne, Groups and communities: https://studymelbourne.vic.gov.au/living-here/social-life/groups-and-communities
- eSafety Commissioner, Safety by Design FAQ: https://www.esafety.gov.au/industry/safety-by-design/faq
- OAIC, Australian Privacy Principles quick reference: https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-quick-reference
- Vercel, Next.js on Vercel: https://vercel.com/docs/frameworks/full-stack/nextjs
- Next.js, environment variables: https://nextjs.org/docs/app/guides/environment-variables
- Vercel AI SDK: https://vercel.com/docs/ai-sdk
- OpenAI, Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
