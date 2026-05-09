# StudentBridge App Feature Research

StudentBridge is a Next.js web app for international students in Australia. The product goal is to help students build trusted social, academic, career and community networks after arriving in Australia.

## Product Thesis

International students do not only need information. They need trusted connections and practical pathways: classmates, clubs, local events, support hubs, employers, job opportunities and community groups. StudentBridge should become a practical networking layer that helps students find the right people, events, opportunities and services at the right stage of their student journey.

## Evidence Summary

- Australia has a large, diverse international student market. The Australian Department of Education reported 551,717 international students studying in Australia in January 2026, with 58% from China, India, Nepal, Vietnam and Bangladesh.
- QILT's 2024 international student findings show strong overall living satisfaction, but work experience in the field of study was the weakest living-experience area.
- Study Australia's 2024 Student Survey found that only 17% of international students surveyed had used local state or territory support services or study hubs, while students who used them reported 92% satisfaction.
- Study Australia's Industry Experience Program demonstrates demand for structured ways to connect students with employers through real industry projects.
- Study Melbourne highlights local hubs, clubs, sport, interest groups and events as practical ways for students to build community and skills.
- eSafety's Safety by Design guidance is relevant because StudentBridge involves user profiles, listings, events and messaging.
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
- Local event and community suggestions
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

- Clubs and societies
- Cultural groups
- Volunteering
- Sport and interest events
- Local city community groups

StudentBridge value:

- Club directory
- Volunteer opportunity directory
- Event filtering by interest, city and language
- Saved events and reminders

### Sponsor or Partner

Examples:

- Education providers
- Employers and recruiters
- Study hubs
- Local councils
- Professional associations
- Student accommodation providers
- Local venues and businesses

StudentBridge value:

- Promote verified events
- Reach international students by city and interest
- Track registrations, attendance and engagement
- Build trust with students through verified partner profiles

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
- Goals: make friends, find work, join clubs, find job opportunities, volunteer, get support
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

### 3. Clubs and Communities Directory

Concept backup: `../assets/concepts/generated-v1/03-communities-directory.png`

Purpose:

- Help students discover trusted groups beyond their immediate class.

Entries:

- Student clubs
- Cultural groups
- Sport groups
- Study groups
- Professional associations
- City-based student communities

### 4. Job Board Finding

Concept backup: `../assets/concepts/generated-v1/04-mentor-matching.png` is now deprecated and should be replaced by a job board concept in the next design pass.

Purpose:

- Help students find trusted job, internship, volunteering and industry-experience opportunities relevant to international students.

MVP version:

- Use curated listings and simple filters instead of complex real-time matching.
- Filter by city, work type, study area, industry, experience level, visa/work-rights relevance and availability.
- Let students save opportunities, view employer context and open a clear apply/contact path.

Safety:

- Students choose when to share application interest or contact details.
- Students control what profile information is visible to employers or partners.
- No exact address sharing.
- Report/block controls.

### 5. AI StudentBridge Assistant

Concept backup: `../assets/concepts/generated-v1/05-ai-assistant.png`

Purpose:

- Give students fast, friendly guidance across the app.

MVP AI features:

- Explain what kind of networking event fits the student's goal.
- Suggest events or communities from app data.
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

### 7. Partner/Sponsor Profiles

Purpose:

- Give sponsors a credible presence without turning the app into generic ads.

Profile fields:

- Organisation name
- Verified status
- Category
- City
- Events or opportunities
- Contact link
- Student-friendly offer or value

MVP sponsor actions:

- Create event
- Promote event
- View basic engagement count

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
   - Output: polished introduction for job, employer or club context

4. AI support router
   - Input: student question
   - Output: suggested support category and official link

### Later AI

1. Multilingual event summaries
2. Smart job/opportunity recommendation explanation
3. Sponsor event quality checker
4. AI-generated event tags from event descriptions
5. Weekly networking plan
6. Analytics summary for sponsors

## Safety and Privacy Requirements

StudentBridge has social-networking elements, so safety should be part of the product from the start.

Minimum safety features:

- User reporting
- Block/mute controls
- Event host verification
- Visible partner verification status
- No exact address sharing in student profiles
- Opt-in messaging or application-interest sharing
- Clear community standards
- Moderation queue for reported users/events

Privacy principles:

- Collect only what is needed for recommendations, saved items and application-interest workflows.
- Keep private profile details off public pages.
- Do not expose personal student data to sponsors.
- Use aggregated analytics for sponsor dashboards.
- Keep API secrets server-side.
- Do not put private keys in `NEXT_PUBLIC_` environment variables.

## Suggested Data Model

Core entities:

- `User`
- `StudentProfile`
- `Organisation`
- `Event`
- `Community`
- `Opportunity`
- `SavedItem`
- `Registration`
- `Report`
- `AiRecommendation`

Important relationships:

- A user has one student profile.
- An organisation can host many events.
- A student can save and register for many events.
- An opportunity belongs to an organisation or partner and can be saved or opened by many students.
- Reports can target users, events, communities or organisations.

## Role Map

- Marketing - Chengzhi: brand, launch copy, user acquisition, sponsor positioning.
- Back-end - Siqi: database, API routes, authentication, sponsor/event data.
- Front-end - Johnny: Next.js UI, responsive screens, components, interaction states.
- Data Analytics and Research: market evidence, feature validation, survey analysis, metrics.
- Finance - Santosh: pricing, sponsor packages, revenue assumptions, cost model.
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
- `/communities` - clubs and groups
- `/jobs` - job board finding
- `/support` - support-service directory
- `/ai` - StudentBridge assistant
- `/partners` - sponsor/partner information

Prototype data approach:

- Start with seeded local data in TypeScript files or JSON.
- Move to a database when the main screens are stable.
- Keep AI recommendations based on known app data first.

## MVP Success Metrics

Student metrics:

- Onboarding completion rate
- Saved events per user
- Event registration clicks
- Job save/apply clicks
- Support-service clicks
- Repeat weekly visits

Sponsor metrics:

- Event impressions
- Event saves
- Registration intent
- Profile clicks
- Cost per engaged student

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
