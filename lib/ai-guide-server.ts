import { z } from "zod";
import { highRiskTopicPattern } from "@/lib/constants";
import { getForumData, getJobs, getStudentProfile, getSupportResources } from "@/lib/data";
import { getCityOfSydneyEvents } from "@/lib/events";
import type { AiResponse, EventItem, ForumPostView, JobOpportunityView, StudentProfileView, SupportResourceView } from "@/lib/types";

export const aiSchema = z.object({
  intent: z.enum(["onboardingPlan", "recommendEvents", "recommendJobs", "summariseForum", "pitchHelper", "supportRouter"]),
  message: z.string().min(1).max(1600)
});

export type AiIntent = z.infer<typeof aiSchema>["intent"];

export type AiContext = {
  profile: StudentProfileView;
  events: EventItem[];
  jobs: JobOpportunityView[];
  forumPosts: ForumPostView[];
  support: SupportResourceView[];
};

export function resolveAiIntent(intent: AiIntent, message: string): AiIntent {
  return highRiskTopicPattern.test(message) ? "supportRouter" : intent;
}

export async function getAiContext(): Promise<AiContext> {
  const [profile, events, jobs, forum, support] = await Promise.all([
    getStudentProfile(),
    getCityOfSydneyEvents(),
    getJobs(),
    getForumData(),
    getSupportResources()
  ]);

  return {
    profile,
    events: events.slice(0, 6),
    jobs: jobs.slice(0, 6),
    forumPosts: forum.posts.slice(0, 6),
    support: support.slice(0, 8)
  };
}

export function buildPrompt(intent: string, message: string, context: unknown) {
  return `You are StudentBridge AI, a bounded assistant for international students in Australia.
Return only JSON with this exact shape:
{
  "summary": "short answer",
  "safetyNote": "optional safety note",
  "cards": [
    { "title": "short title", "body": "useful detail", "source": "app-data|city-of-sydney|official-link|ai", "actionLabel": "optional action" }
  ]
}

Rules:
- Do not provide legal, migration, medical or financial advice as final guidance.
- For high-stakes topics, route students to official resources.
- Prefer app data, City of Sydney event data and official support resources.
- Keep the response friendly, specific and concise.

Intent: ${intent}
Student message: ${message}
Available context:
${JSON.stringify(context, null, 2)}`;
}

export function buildStreamingPrompt(intent: string, message: string, context: unknown) {
  return `You are StudentBridge AI, a bounded assistant for international students in Australia.
Write a concise live response in plain text. Do not return JSON.

Rules:
- Use 2-4 short paragraphs or compact bullets.
- Do not use Markdown syntax, bold markers, headings or code fences.
- Do not provide legal, migration, medical or financial advice as final guidance.
- For high-stakes topics, route students to official resources.
- Prefer app data, City of Sydney event data and official support resources.
- Keep the response friendly, specific and presentation-ready.

Intent: ${intent}
Student message: ${message}
Available context:
${JSON.stringify(context, null, 2)}`;
}

export function parseAiResponse(text: string, fallback: AiResponse): AiResponse {
  try {
    const parsed = JSON.parse(text) as AiResponse;
    const cards = Array.isArray(parsed.cards)
      ? parsed.cards.slice(0, 5).map((card) => ({
          title: card.title || "Next step",
          body: card.body || "Open the matching StudentBridge section and compare your options.",
          source: isCardSource(card.source) ? card.source : "ai",
          actionLabel: card.actionLabel
        }))
      : fallback.cards;

    return {
      summary: parsed.summary || fallback.summary,
      safetyNote: parsed.safetyNote,
      cards
    };
  } catch {
    if (!text) return fallback;
    return { summary: "Here are some practical next steps.", cards: [{ title: "AI suggestion", body: text, source: "ai" }] };
  }
}

export function buildLocalResponse(intent: AiIntent, message: string, context: AiContext): AiResponse {
  const highRisk = highRiskTopicPattern.test(message);
  if (highRisk || intent === "supportRouter") {
    return buildSupportResponse(context);
  }

  if (intent === "recommendEvents") {
    return {
      summary: "Here are event ideas to start with.",
      cards: context.events.slice(0, 3).map((event) => ({
        title: event.title,
        body: `${event.dateLabel} at ${event.location}. ${event.isFree ? "This is free to attend. " : ""}${event.description}`,
        source: "city-of-sydney",
        actionLabel: "Open Events"
      }))
    };
  }

  if (intent === "recommendJobs") {
    return {
      summary: "Start with roles that match your study area and current stage.",
      cards: context.jobs.slice(0, 3).map((job) => ({
        title: job.title,
        body: `${job.company} • ${job.workType} • ${job.city}. ${job.description}`,
        source: "app-data",
        actionLabel: job.paid ? "Compare this role" : "Use for portfolio experience"
      }))
    };
  }

  if (intent === "summariseForum") {
    return {
      summary: "The forum is currently strongest around jobs, study confidence and everyday Sydney questions.",
      cards: context.forumPosts.slice(0, 3).map((post) => ({
        title: post.title,
        body: `${post.replyCount} replies in ${post.topic.name}. Useful tags: ${post.tags.slice(0, 3).join(", ")}.`,
        source: "app-data",
        actionLabel: "Open Forum"
      }))
    };
  }

  if (intent === "pitchHelper") {
    return {
      summary: "Use a short intro that connects your study, goal and next question.",
      cards: [
        {
          title: "20-second intro",
          body: `Hi, I am a ${context.profile.studyArea} student in ${context.profile.city}. I am looking for beginner-friendly ways to build local experience and meet people in my field.`,
          source: "ai",
          actionLabel: "Use at an event"
        },
        {
          title: "Follow-up question",
          body: "What helped you get your first local opportunity, and what would you recommend I do this week?",
          source: "ai",
          actionLabel: "Ask after your intro"
        }
      ]
    };
  }

  const firstEvent = context.events[0];
  const firstJob = context.jobs[0];
  const firstForumPost = context.forumPosts[0];

  return {
    summary: `Start with a simple ${context.profile.city} plan: one event, one forum thread and one job lead.`,
    cards: [
      {
        title: "This week",
        body: `Update your profile around ${context.profile.studyArea}, then save one event and one job lead before your next study week starts.`,
        source: "app-data",
        actionLabel: "Update profile"
      },
      {
        title: firstEvent?.title ?? "Find one student-friendly event",
        body: firstEvent ? `${firstEvent.dateLabel} at ${firstEvent.location}.` : "Open Events and look for a career, workshop or community listing.",
        source: firstEvent ? "city-of-sydney" : "app-data",
        actionLabel: "Open Events"
      },
      {
        title: firstForumPost?.title ?? "Ask one practical question",
        body: firstForumPost ? `Join a thread in ${firstForumPost.topic.name} with ${firstForumPost.replyCount} replies.` : "Use the forum for questions about jobs, study or city life.",
        source: "app-data",
        actionLabel: "Open Forum"
      },
      {
        title: firstJob?.title ?? "Shortlist one job lead",
        body: firstJob ? `${firstJob.company} in ${firstJob.city}: ${firstJob.description}` : "Compare work-rights-friendly job leads that fit your study area.",
        source: "app-data",
        actionLabel: "Open Jobs"
      }
    ]
  };
}

export function buildResponseFromStreamText(text: string, fallback: AiResponse): AiResponse {
  const cleanText = cleanAppText(text);
  if (!cleanText) return fallback;

  return {
    summary: firstSentence(cleanText) || fallback.summary,
    safetyNote: fallback.safetyNote,
    cards: [
      {
        title: "AI Guide response",
        body: cleanText,
        source: "ai",
        actionLabel: "Use this plan"
      },
      ...fallback.cards.slice(0, 2)
    ]
  };
}

export function responseToStreamText(response: AiResponse) {
  const cardText = response.cards.map((card) => `${card.title}: ${card.body}`).join("\n");
  return [response.summary, response.safetyNote, cardText].filter(Boolean).join("\n\n");
}

function buildSupportResponse(context: AiContext): AiResponse {
  const supportCards = context.support.slice(0, 3).map((resource) => ({
    title: resource.title,
    body: `${resource.category}: ${resource.description}`,
    source: "official-link" as const,
    actionLabel: "Open Support"
  }));

  return {
    summary: "For this topic, use official support before acting.",
    safetyNote: "StudentBridge can help you prepare questions, but official services or qualified professionals should guide legal, migration, medical or financial decisions.",
    cards: supportCards.length
      ? supportCards
      : [
          {
            title: "Official support",
            body: "Open Support and use the official links for work rights, study support, wellbeing or emergency help.",
            source: "official-link",
            actionLabel: "Open Support"
          }
        ]
  };
}

function firstSentence(text: string) {
  return text.split(/(?<=[.!?])\s+/)[0]?.slice(0, 220);
}

function cleanAppText(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[*]\s+/gm, "- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isCardSource(source: string): source is AiResponse["cards"][number]["source"] {
  return ["app-data", "city-of-sydney", "official-link", "ai"].includes(source);
}
