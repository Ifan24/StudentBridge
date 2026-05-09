# Backend Architecture & Design Patterns

> StudentBridge — backend design reference.
> Audience: team members and presentation reviewers.
> Maintainer: Siqi (Back-end).

---

## 1. Overview

StudentBridge is a Next.js 16 web application that helps international students in Australia build trusted social, academic, career and community networks. The backend is built **inside the same Next.js project** using the App Router's Route Handlers — there is no separate backend service.

### Why a single Next.js project (not a separate Node/Express backend)?

| Concern | Decision |
|---|---|
| Deployment | Single Vercel deployment, zero infra setup |
| Type safety | Shared TypeScript types across frontend and backend |
| Auth | One session model across pages and APIs |
| Cost | $0 on the Vercel Hobby tier for the prototype |
| DX | One repo, one `npm run dev`, one CI pipeline |

### Stack summary

| Layer | Technology | Reason |
|---|---|---|
| Runtime | Node.js (Vercel Edge / Serverless) | Default for Next.js App Router |
| Framework | Next.js 16 App Router + TypeScript | Required tech direction (`AGENTS.md`) |
| ORM | Prisma 7 | Schema-first, migrations, type-safe queries, `prisma studio` for demos |
| Database | SQLite (dev) → PostgreSQL (prod) | SQLite needs no server for development; Postgres for Vercel deployment |
| Auth | NextAuth.js v5 (Auth.js) | Industry standard, free, supports OAuth + magic links |
| Validation | Zod 4 | Single schema for runtime validation **and** TypeScript types |
| Styling (frontend) | Tailwind CSS 4 | Required tech direction |

---

## 2. Layered Architecture

The backend follows a **classic four-layer architecture**. Every API request flows top to bottom; every response flows bottom to top.

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT  (browser, mobile)                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTP request (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  1. ROUTE HANDLER LAYER       src/app/api/**/route.ts       │
│     • Parse request                                         │
│     • Check authentication (auth())                         │
│     • Delegate to validator and service                     │
│     • Return standardised JSON envelope                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  2. VALIDATION LAYER          src/lib/validators/*.ts       │
│     • Zod schemas (single source of truth for shape)        │
│     • 422 with field-level errors on bad input              │
│     • Generates TypeScript input types via z.infer<>        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  3. SERVICE LAYER             src/lib/services/*.ts         │
│     • Business rules (capacity check, ownership check,      │
│       slug generation, mentor matching algorithm, ...)      │
│     • No HTTP knowledge — testable in isolation             │
│     • Throws domain errors (FORBIDDEN, EVENT_CANCELLED,...) │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  4. DATA ACCESS LAYER         src/lib/db/prisma.ts          │
│     • Prisma client singleton                               │
│     • Type-safe queries generated from schema.prisma        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                    ┌────────────┐
                    │  DATABASE  │  SQLite (dev) / Postgres (prod)
                    └────────────┘
```

### Why four layers and not three?

A common shortcut is to put validation inside the route handler. Splitting validation into its own layer gives:

- **Reuse** — the same `createEventSchema` is used by REST routes, server actions, and seed scripts.
- **Type generation** — `z.infer<typeof createEventSchema>` produces the input type used by the service, so the service signature can never drift from the validator.
- **Testability** — schemas can be unit tested without spinning up a request.

---

## 3. Folder Structure

```
StudentBridge/
├── prisma/
│   ├── schema.prisma           ← single source of truth for the data model
│   ├── migrations/             ← versioned SQL migrations
│   └── seed.ts                 ← deterministic demo data
│
├── src/
│   ├── app/
│   │   ├── api/                ← Layer 1: Route Handlers
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── events/
│   │   │   │   ├── route.ts                  GET list, POST create
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts              GET / PATCH / DELETE
│   │   │   │       └── register/route.ts     POST register
│   │   │   ├── communities/route.ts
│   │   │   ├── mentors/route.ts              GET list, GET ?match=true
│   │   │   ├── profile/route.ts              GET / PATCH
│   │   │   └── reports/route.ts              POST report
│   │   │
│   │   └── (frontend pages — Johnny's territory)
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   └── response.ts     ← Standardised response envelope
│   │   ├── auth/
│   │   │   └── auth.ts         ← NextAuth v5 configuration
│   │   ├── db/
│   │   │   └── prisma.ts       ← Prisma client singleton
│   │   ├── services/           ← Layer 3: Business logic
│   │   │   ├── event-service.ts
│   │   │   ├── community-service.ts
│   │   │   ├── mentor-service.ts
│   │   │   ├── profile-service.ts
│   │   │   └── report-service.ts
│   │   └── validators/         ← Layer 2: Zod schemas
│   │       ├── event.ts
│   │       ├── profile.ts
│   │       └── report.ts
│   │
│   └── types/
│       └── next-auth.d.ts      ← Type augmentation for Session
│
├── docs/
│   ├── backend-architecture.md ← this file
│   └── app-concept.md
│
├── .env.example
├── package.json
└── tsconfig.json
```

### Naming conventions

| Pattern | Example | Reason |
|---|---|---|
| `kebab-case.ts` for files | `event-service.ts` | Consistent across OS, matches Next.js convention |
| `PascalCase` for types | `CreateEventInput` | Standard TypeScript |
| `camelCase` for exports | `eventService`, `createEventSchema` | Standard JavaScript |
| `[id]` dynamic segments | `events/[id]/route.ts` | Next.js App Router convention |
| `(group)` route groups | `(dashboard)/profile/page.tsx` | Next.js convention, no URL impact |

---

## 4. Design Patterns Used

This project intentionally applies several well-known design patterns. Each is listed with **what** it does, **why** it is used here, and **where** to find it in the codebase.

### 4.1 Singleton — Prisma client

**What:** Exactly one instance of the Prisma client per process.

**Why:** During Next.js development, hot reload re-evaluates modules on every save. A naive `new PrismaClient()` would create a new database connection on every reload until the connection pool is exhausted. The singleton pattern attaches the instance to `globalThis` in development so it survives reloads, while production gets a fresh instance per serverless invocation.

**Where:** `src/lib/db/prisma.ts`

```ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### 4.2 Service Layer (a.k.a. Application Service)

**What:** All business logic lives in service modules. Route handlers are thin and only translate HTTP concerns.

**Why:**
- **Reusability** — the same `eventService.create()` can be called from a REST route, a server action, a seed script, or a future GraphQL resolver.
- **Testability** — services have no `Request`/`Response` dependency, so they can be unit tested with plain function calls.
- **Single responsibility** — route handlers handle HTTP; services handle "what the app does."

**Where:** `src/lib/services/*.ts`

```ts
// event-service.ts — business logic
export const eventService = {
  async register(eventId: string, userId: string) {
    const event = await prisma.event.findUnique({ /* ... */ });
    if (!event) throw new Error("EVENT_NOT_FOUND");
    if (event.status === "CANCELLED") throw new Error("EVENT_CANCELLED");
    const isFull = event.capacity !== null
      && event._count.registrations >= event.capacity;
    return prisma.registration.create({
      data: { eventId, userId, status: isFull ? "WAITLISTED" : "CONFIRMED" },
    });
  },
};
```

### 4.3 Schema-Driven Validation (DTO via Zod)

**What:** A single Zod schema defines the input shape, validates incoming requests, and generates the TypeScript type used downstream.

**Why:** Eliminates the duplication you'd see in classical DTO + class-validator setups (one class for the type, one set of decorators for validation). Zod gives you both from one declaration.

**Where:** `src/lib/validators/*.ts`

```ts
export const createEventSchema = z
  .object({
    title: z.string().min(3).max(200),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    // ...
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: "endsAt must be after startsAt",
    path: ["endsAt"],
  });

export type CreateEventInput = z.infer<typeof createEventSchema>;
```

### 4.4 Result Envelope (Discriminated Union)

**What:** Every API response has the same shape: `{ ok: true, data }` or `{ ok: false, error }`. The `ok` field discriminates the union, so TypeScript narrows correctly on the client.

**Why:** A predictable contract means the frontend never has to guess where data lives or how errors are reported. It also makes error handling exhaustive — you cannot forget the failure case because the type system forces you to handle both branches.

**Where:** `src/lib/api/response.ts`

```ts
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; details?: unknown } };

export const apiError = {
  unauthorized: (msg = "Unauthorized") => fail("UNAUTHORIZED", msg, 401),
  notFound:     (msg = "Not found")    => fail("NOT_FOUND", msg, 404),
  validation:   (details: unknown)     => fail("VALIDATION_ERROR", "Validation failed", 422, details),
  // ...
};
```

### 4.5 Adapter — NextAuth providers

**What:** NextAuth abstracts identity providers (Google, GitHub, email, credentials) behind a single `Provider` interface. Switching from demo Credentials to production Google OAuth is a one-line change.

**Why:** We can ship a working demo today (`Credentials` provider against seeded users) and swap in real OAuth later without touching the rest of the codebase.

**Where:** `src/lib/auth/auth.ts`

### 4.6 Polymorphic Association — Report.targetType + targetId

**What:** A single `Report` table can reference any of `User`, `Event`, `Community`, or `Organisation` via a `targetType` enum and a free-form `targetId` string.

**Why:** Reports against different entity types share the same workflow (pending → reviewing → resolved). One table is simpler than four. The cost is that the database cannot enforce the FK — that is enforced in the service layer.

**Where:** `prisma/schema.prisma`

```prisma
model Report {
  targetType  ReportTarget   // USER | EVENT | COMMUNITY | ORGANISATION
  targetId    String         // resolved in the service layer
  // ...
  @@index([targetType, targetId])
}
```

### 4.7 Soft Cancellation via Status Enum

**What:** Events are never hard-deleted. `DELETE /api/events/:id` sets `status = CANCELLED`.

**Why:**
- Registered users can still see their cancellation in their history.
- Audit trail is preserved.
- Reversible — a cancelled event can be reactivated.

**Where:** `prisma/schema.prisma` (`EventStatus` enum) and `event-service.ts` (`cancel()`)

### 4.8 Repository-via-ORM

**What:** Prisma itself plays the role of the repository. Services call `prisma.event.findMany(...)` directly rather than going through a hand-written `EventRepository` class.

**Why:** Adding a repository layer on top of Prisma would be ceremony without benefit at this scale. Prisma is already the abstraction over SQL. If we ever needed to swap Prisma for something else, we would extract a repository at that point.

### 4.9 Privacy by Default

**What:** New profiles are private and not opted in to matching:

```prisma
isPublic        Boolean @default(false)
optInMatching   Boolean @default(false)
```

**Why:** Required by `AGENTS.md`: *"opt-in matching"*, *"private profile fields by default"*. Default values in the schema make the safe choice the easy choice.

---

## 5. Request Lifecycle — Worked Example

Concrete walk-through of `POST /api/events` (creating an event).

```
1. Client
     POST /api/events
     Cookie: session=...
     Body: { title, description, startsAt, endsAt, city, ... }

2. Route Handler              src/app/api/events/route.ts
     • const session = await auth()
         → not logged in?  return apiError.unauthorized()  (401)
     • const parsed = createEventSchema.safeParse(body)
         → invalid?         return apiError.validation(...) (422)
     • call service:
         eventService.create(parsed.data, session.user.id)

3. Validator                  src/lib/validators/event.ts
     • Zod runs at step 2
     • Coerces startsAt/endsAt to Date
     • Refines: endsAt > startsAt

4. Service                    src/lib/services/event-service.ts
     • slugify(title) → URL-safe unique slug
     • prisma.event.create({ data: { ..., hostId, slug } })

5. Data layer                 src/lib/db/prisma.ts
     • Singleton client emits SQL
     • SQLite/Postgres returns the row

6. Service returns the event row

7. Route Handler
     • return ok(event, { status: 201 })
     • Response body: { ok: true, data: { id, slug, title, ... } }

8. Client receives 201 + envelope
```

Every endpoint follows this same shape. Once the team understands one route, they understand them all.

---

## 6. Data Model Summary

Nine domain entities, plus three NextAuth tables.

```
                ┌──────────┐
                │   User   │ ← role: STUDENT | MENTOR | ORGANISATION | ADMIN
                └────┬─────┘
                     │ 1
       ┌─────────────┼─────────────┬──────────────┐
       │             │             │              │
       ▼ 0..1        ▼ 0..1        ▼ 0..*         ▼ 0..*
 ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌────────────┐
 │ Profile  │  │  Mentor  │  │ Registration │  │ SavedItem  │
 └──────────┘  └──────────┘  └──────┬───────┘  └────────────┘
                                    │ *..1
                                    ▼
                              ┌──────────┐  *..1   ┌──────────────┐
                              │  Event   │────────►│ Organisation │
                              └──────────┘         └──────┬───────┘
                                                         │ 1..*
                                                         ▼
                                                   ┌───────────┐
                                                   │ Community │
                                                   └───────────┘

       ┌─────────────────────────────────────────┐
       │ Report   (polymorphic — targets any of  │
       │           User | Event | Community |    │
       │           Organisation via targetType)  │
       └─────────────────────────────────────────┘
```

### Key relationships

| From | Cardinality | To | Cascade |
|---|---|---|---|
| User | 1 ↔ 0..1 | Profile | Delete user → delete profile |
| User | 1 ↔ 0..1 | Mentor | Delete user → delete mentor record |
| User | 1 ↔ 0..* | Registration | Delete user → delete registrations |
| Event | 1 ↔ 0..* | Registration | Delete event → delete registrations |
| Organisation | 1 ↔ 0..* | Event | Delete org → events keep null orgId |
| User (reporter) | 1 ↔ 0..* | Report | Delete user → delete their reports |

### Constraints worth noting

- `Registration` has a unique `(userId, eventId)` — a user cannot register for the same event twice.
- `SavedItem` has a unique `(userId, itemType, itemId)` — same item cannot be bookmarked twice.
- `Account` has a unique `(provider, providerAccountId)` — required by NextAuth.
- `Event.slug`, `Community.slug`, `Organisation.slug`, `User.email` are all unique.

---

## 7. Security & Privacy by Design

These principles are baked into the schema and code, not added later.

### Secrets management

- All secrets (`AUTH_SECRET`, `DATABASE_URL`, AI provider keys) live in `.env`, never committed.
- **Never** prefix sensitive variables with `NEXT_PUBLIC_` — that exposes them to the browser bundle.
- AI calls happen server-side in route handlers, so the AI provider key is never shipped to the client.

### Authorization

- Authentication: every protected route calls `await auth()` and returns `401` on missing session.
- Authorization: ownership is checked in the service layer (e.g. only the host can update an event — `event-service.ts` `update()` throws `FORBIDDEN`).
- Role-based access (admin moderation queue) is enforced by checking `session.user.role`.

### Privacy defaults

| Field | Default | Why |
|---|---|---|
| `Profile.isPublic` | `false` | Profiles private until the user opts in |
| `Profile.optInMatching` | `false` | No mentor/buddy matching without explicit opt-in |
| `Organisation.verified` | `false` | Hosts must be verified before their events appear in trusted lists |
| `Event.location` | venue name only | Per `AGENTS.md`: no exact addresses for safety |

### Moderation

- Any logged-in user can submit a `Report` against a User, Event, Community or Organisation.
- Reports flow through `PENDING → REVIEWING → RESOLVED | DISMISSED`.
- Admins (role `ADMIN`) see the queue and resolve reports.

### Validation

- Every write endpoint validates with Zod. No data ever reaches the database without passing a schema.
- IDs are validated as CUIDs (`z.string().cuid()`) to reject malformed identifiers early.

---

## 8. Error Handling Strategy

Errors are a first-class concern, not an afterthought. The strategy has three rules:

1. **Validation errors → 422** with field-level details (from Zod's `treeifyError`).
2. **Domain errors → typed throws** from services. Route handlers catch and translate to HTTP codes:
   - `FORBIDDEN` → 403
   - `EVENT_NOT_FOUND` → 404
   - `EVENT_CANCELLED` → 409
3. **Unknown errors → 500** with a generic message. Internal details are logged, never returned to the client.

Example:

```ts
try {
  const reg = await eventService.register(id, session.user.id);
  return ok(reg, { status: 201 });
} catch (err) {
  if (err instanceof Error) {
    if (err.message === "EVENT_NOT_FOUND") return apiError.notFound();
    if (err.message === "EVENT_CANCELLED") return apiError.conflict("Event has been cancelled");
  }
  if (isPrismaUniqueViolation(err)) return apiError.conflict("Already registered");
  return apiError.internal();
}
```

This way, the client always gets a meaningful HTTP status and a structured error object — never a 500 for a user-recoverable mistake.

---

## 9. Extension Points

Where the next features will plug in.

| Feature | Hook |
|---|---|
| Email magic-link login | Add `Email` provider in `auth.ts`, set up SMTP env vars |
| Google / Microsoft OAuth | Add provider in `auth.ts`, set `AUTH_GOOGLE_ID/SECRET` env vars |
| AI recommendations | Add `lib/ai/` module, call from `event-service.recommend()` |
| Push notifications | New `notification-service.ts` + `Notification` model |
| File uploads (avatars) | Add `lib/storage/` (Vercel Blob or S3), update `User.image` |
| GraphQL | Add `app/api/graphql/route.ts`, reuse the same services |
| Background jobs | Vercel Cron triggers a route handler that calls services |

The layered architecture means most new features touch one or two layers, not all four.

---

## 10. Trade-offs & Limitations

Honest list of things that are intentionally simple for the prototype.

| Trade-off | Reason | When to revisit |
|---|---|---|
| SQLite in development | Zero setup, runs offline | Already designed to switch to Postgres in prod via `DATABASE_URL` |
| No repository abstraction over Prisma | Premature for this scale | If we ever swap ORMs |
| JWT sessions, not DB sessions | Simpler, no `@auth/prisma-adapter` dependency | When we need server-side session revocation |
| Polymorphic FK on `Report` | Simplicity over referential integrity | If reports grow into a full moderation pipeline |
| `interests`/`tags` stored as JSON strings | SQLite has no native array type | When we move to Postgres, switch to `String[]` |
| In-memory mentor matching | Works for hundreds of mentors | Move to a vector search (e.g. pgvector) at scale |
| No rate limiting | Out of scope for prototype | Add `@upstash/ratelimit` before public launch |

---

## 11. Local Setup

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env
# Generate AUTH_SECRET:  openssl rand -base64 32

# 3. Database
npm run db:push     # apply schema to SQLite
npm run db:seed     # populate demo data

# 4. Run
npm run dev         # http://localhost:3000

# Useful extras
npm run db:studio   # GUI database explorer at localhost:5555
npm run db:reset    # wipe and reseed
```

---

## 12. Glossary

| Term | Meaning here |
|---|---|
| **Route Handler** | A `route.ts` file under `src/app/api/` exporting `GET`, `POST`, etc. — Next.js's term for an API endpoint. |
| **Server Action** | A function tagged `"use server"` that the client can call directly. We use route handlers instead for clarity. |
| **Provider** | A NextAuth identity source (Google, GitHub, Credentials, ...). |
| **Adapter** | A NextAuth integration that persists users/sessions to a database. We use JWT sessions, so no adapter is needed. |
| **CUID** | Collision-resistant unique ID — Prisma's default for `String @id`. |
| **Cascade** | Database behaviour: deleting a row also deletes rows that reference it. |

---

*Last updated: prototype phase. Maintained by the back-end role.*
