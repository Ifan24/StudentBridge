import { NextResponse } from "next/server";
import { DEMO_USER_ID } from "@/lib/constants";
import {
  aiSchema,
  buildLocalResponse,
  buildPrompt,
  getAiContext,
  parseAiResponse,
  resolveAiIntent
} from "@/lib/ai-guide-server";
import { getActiveSubscriptionLimit } from "@/lib/data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";
import type { AiResponse } from "@/lib/types";

export async function POST(request: Request) {
  const payload = aiSchema.parse(await request.json());
  const intent = resolveAiIntent(payload.intent, payload.message);
  const context = await getAiContext();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(buildLocalResponse(intent, payload.message, context));
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

  const prompt = buildPrompt(intent, payload.message, context);
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const fallback = buildLocalResponse(intent, payload.message, context);

  let parsed: AiResponse;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini returned ${response.status}`);
    }

    const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    parsed = parseAiResponse(text, fallback);
  } catch (error) {
    logServerFallback("AI Guide used local fallback:", error);
    parsed = fallback;
  } finally {
    clearTimeout(timeout);
  }

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
