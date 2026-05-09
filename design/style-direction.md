# StudentBridge Design Direction

This is the working art direction for the first StudentBridge web prototype. The goal is not a polished generic SaaS dashboard. The goal is a practical student network product that feels rooted in Australian student life: campus noticeboards, city transport maps, verified event listings, community desks, mentor introductions and official support pathways.

## Design Position

StudentBridge should feel like:

- a trusted city-and-campus guide for new arrivals
- a networking workspace, not a marketing landing page
- calm enough for safety and support, lively enough for student life
- built around real actions: save event, join group, request intro, find support
- specific to international students in Australia

It should not feel like:

- a purple-blue AI dashboard template
- a pile of rounded cards with decorative icons
- a fake analytics product
- a social app pretending to solve everything with chat
- a sponsor advertising portal

## What Was Wrong With v1

The first generated concept images are useful only as feature inventory. They show the right screens, but the visual language is too familiar.

Problems to correct:

- glossy gradient surfaces make the app feel synthetic
- card grids dominate every screen, so all features feel the same
- fake dashboard density hides the actual student workflow
- little connection to Australian campuses, cities, commutes or community spaces
- too many icons and labels where stronger layout would do the work
- the AI assistant looks like a generic chatbot instead of a guide inside the product

## Design System

Use a restrained civic-student palette. Blue is the product anchor, but the interface should not become one-note blue.

- Ink: `#102033`
- Muted ink: `#43556A`
- Paper: `#FFFFFF`
- Mist surface: `#F4F8FB`
- Notice surface: `#F7F3EA`
- Border: `#D7E2EA`
- Bridge blue: `#1769E0`
- Eucalypt green: `#1E8A6A`
- Violet marker: `#6B4FD8`
- Safety amber: `#B7791F`
- Error red: `#B64242`

Typography:

- Use Plus Jakarta Sans or Manrope for both headings and body.
- Do not use Inter, Roboto, Arial or default system fonts as the visible identity.
- Headings should be confident but not oversized. This is an app workspace, not a hero site.
- Body copy should stay plain and useful. Avoid inspirational filler.

Spacing and shape:

- Base unit: 4px.
- Common gaps: 8, 12, 16, 24, 32, 48.
- Cards and panels: 8px radius maximum.
- Buttons and inputs: 6-8px radius.
- Pills are allowed only for filters, tags and status labels.
- Shadows should be rare. Prefer borders, background contrast and active-state color.

Motion:

- Use short transitions: 140-220ms.
- Motion should confirm action or clarify navigation.
- Avoid decorative entrance animations.
- Respect reduced-motion settings.

## Visual Vocabulary

The main metaphor is a city noticeboard connected by a light network map.

Use:

- event rows that resemble posted opportunities
- city/campus rails for filters and navigation
- verified-host stamps
- compact timeline strips for first-week plans
- side notes for official resources
- connector lines between onboarding choices and recommendations
- initials or placeholders until real people/assets exist

Avoid:

- gradient blobs, orbs and glass panels
- left-border accent cards
- fake KPI blocks unless the screen is genuinely about sponsor performance
- logo walls, testimonial blocks or fabricated social proof
- generic illustration scenes
- icon spam

## Layout Rules

Desktop app shell:

- Left navigation: Home, Events, Communities, Mentors, Support, Partners, AI Guide.
- Top utility row: city selector, search, saved items, profile.
- Main workspace: one primary task per route.
- Right context panel only when it helps the task, such as a first-week plan, saved shortlist or official-source notes.

Mobile shell:

- Bottom navigation: Home, Events, Communities, AI Guide.
- Support and Mentors can live behind More until the mobile IA is proven.
- Search and city filters collapse into a top drawer.
- Touch targets should be at least 44px.

Composition:

- Prefer rows, rails, timelines and split panes over repeated card grids.
- Give each route a distinct structure so the product feels authored.
- Use empty space deliberately; do not fill gaps with fake stats.
- If content is missing, use honest placeholders such as `[campus photo]`, `[partner logo]` or initials.

## Route Direction

### Onboarding

Make onboarding feel like building a first-week plan.

- Left rail: arrival stage and progress.
- Center: one decision at a time, with large selectable options.
- Right panel: live plan preview based on choices.
- Final state: 3-5 recommended actions with clear reasons.

### Events

Make events feel like a trusted campus/city board.

- Top command bar: city, date, goal, format and free/paid.
- Main list: wide rows with host, date, location, category and verification.
- Secondary rail: saved events and "this week" shortcuts.
- Event detail: clear register-interest action and host trust markers.

### Communities

Make communities feel like real groups, not app tiles.

- Category rails: cultural, study, sport, volunteering, professional.
- Entries should show next event, host verification and member context.
- Recommendations must explain why the group is relevant.

### Mentors

Make matching safe and opt-in.

- Start with the student's goal.
- Match cards show reason-for-match, availability and privacy level.
- Primary action: request intro.
- Avoid dating-app mechanics or swipe patterns.

### Support

Make support-service discovery official, calm and clear.

- Categories should be scannable: study hubs, accommodation, work rights, safety, wellbeing.
- Official-source indicators must be visible.
- The AI router can ask questions, but final answers should route to official resources.
- Never make legal, migration, medical or financial advice look like the app's own answer.

### Partners

Make partner/sponsor profiles credible without making the product feel ad-funded.

- Profile layout: organisation, verification, active events, student value, contact path.
- Show engagement only as modest aggregate metrics.
- Avoid banners, aggressive CTAs and promotional copy.

### AI Guide

Make AI a practical assistant embedded in the product.

- Chat is one mode, not the whole screen.
- Pair responses with structured cards: suggested events, groups, intros or weekly plans.
- Clearly label whether a response uses app data or official links.
- Quick actions: draft intro, suggest events, build weekly plan, find support.

## Prototype Requirement

Before generating more static images, create a browser-viewable HTML/CSS v0. It should prove tone and structure first, not final polish.

The v0 should include five route concepts:

1. Onboarding plus first-week plan
2. Events/community discovery workspace
3. Support-service discovery
4. Partner/sponsor profile
5. AI Guide with structured recommendations

Use real layout, real typography tokens and honest placeholders. Do not create more AI-generated concept images until the v0 direction feels specific and usable.
