import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USER_ID } from "@/lib/constants";
import { getActiveSubscriptionLimit, getForumData, getJobs, getStudentProfile, getSupportResources } from "@/lib/data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";
import type { AiResponse } from "@/lib/types";

const aiSchema = z.object({
  intent: z.enum(["onboardingPlan", "recommendEvents", "recommendJobs", "summariseForum", "pitchHelper", "supportRouter"]),
  message: z.string().min(1).max(1600)
});

export async function POST(request: Request) {
  const payload = aiSchema.parse(await request.json());

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
      summary: "Here is a quick StudentBridge suggestion.",
      safetyNote: "For official guidance, use the linked support resources and qualified services.",
      cards: [
        {
          title: "Next step",
          body: fallbackByIntent(payload.intent),
          source: "app-data"
        }
      ]
    } satisfies AiResponse);
  }

  const usage = await getActiveSubscriptionLimit();
  if (usage.aiUsedThisMonth >= usage.aiMonthlyLimit) {
    return NextResponse.json({
      summary: "You have reached this month’s AI Guide usage for your current plan.",
      safetyNote: "Core events, forum, jobs and support resources are still available for free.",
      cards: [
        {
          title: "Upgrade for more AI coaching",
          body: `Your ${usage.activePlanSlug} plan includes ${usage.aiMonthlyLimit} AI uses this month. Upgrade to Plus or Pro for more plans, pitch help and job-fit explanations.`,
          source: "app-data",
          actionLabel: "Open Premium"
        }
      ]
    } satisfies AiResponse, { status: 402 });
  }

  const [profile, jobs, forum, support] = await Promise.all([
    getStudentProfile(),
    getJobs(),
    getForumData(),
    getSupportResources()
  ]);
  const prompt = buildPrompt(payload.intent, payload.message, {
    profile,
    jobs: jobs.slice(0, 6),
    forumPosts: forum.posts.slice(0, 6),
    support
  });
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: `Gemini returned ${response.status}` }, { status: 502 });
  }

  const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const parsed = parseAiResponse(text);

  if (hasDatabaseUrl()) {
    try {
      await prisma.aiInteraction.create({
        data: {
          intent: payload.intent,
          promptSummary: payload.message.slice(0, 240),
          response: parsed,
          userId: DEMO_USER_ID
        }
      });
    } catch (error) {
      logServerFallback("Unable to log AI interaction:", error);
    }
  }

  return NextResponse.json(parsed);
}

function buildPrompt(intent: string, message: string, context: unknown) {
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

function parseAiResponse(text: string): AiResponse {
  try {
    const parsed = JSON.parse(text) as AiResponse;
    return {
      summary: parsed.summary || "Here are some practical next steps.",
      safetyNote: parsed.safetyNote,
      cards: Array.isArray(parsed.cards) ? parsed.cards.slice(0, 5) : []
    };
  } catch {
    return {
      summary: text || "Here are some practical next steps.",
      cards: [{ title: "AI suggestion", body: text || "Try refining your question with your city, goal and study area.", source: "ai" }]
    };
  }
}

function fallbackByIntent(intent: string) {
  const fallbacks: Record<string, string> = {
    onboardingPlan: "Complete your profile, save one event this week, follow two forum topics and shortlist one job opportunity.",
    recommendEvents: "Open Events and filter by your city, free events and career workshops.",
    recommendJobs: "Start with work-rights-friendly part-time roles and internships that match your study area.",
    summariseForum: "Browse trending forum posts and save threads about jobs, study help and city life.",
    pitchHelper: "Write one sentence about who you are, what you study and what kind of opportunity you are seeking.",
    supportRouter: "Use official resources for work rights, wellbeing, emergency and accommodation questions."
  };
  return fallbacks[intent] ?? fallbacks.onboardingPlan;
}
