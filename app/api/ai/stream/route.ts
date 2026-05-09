import { DEMO_USER_ID } from "@/lib/constants";
import {
  aiSchema,
  buildLocalResponse,
  buildResponseFromStreamText,
  buildStreamingPrompt,
  getAiContext,
  resolveAiIntent,
  responseToStreamText
} from "@/lib/ai-guide-server";
import { getActiveSubscriptionLimit } from "@/lib/data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";
import type { AiResponse } from "@/lib/types";

type StreamEvent =
  | { event: "token"; data: { text: string } }
  | { event: "final"; data: AiResponse }
  | { event: "error"; data: { message: string } };

const encoder = new TextEncoder();

export async function POST(request: Request) {
  const payload = aiSchema.parse(await request.json());
  const intent = resolveAiIntent(payload.intent, payload.message);
  const context = await getAiContext();
  const fallback = buildLocalResponse(intent, payload.message, context);

  if (!process.env.GEMINI_API_KEY) {
    return streamLocalResponse(fallback);
  }

  const usage = await getActiveSubscriptionLimit();
  if (usage.aiUsedThisMonth >= usage.aiMonthlyLimit) {
    return streamLocalResponse({
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
    });
  }

  const prompt = buildStreamingPrompt(intent, payload.message, context);
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let streamedText = "";
      const abortController = new AbortController();
      const timeout = setTimeout(() => abortController.abort(), 15000);

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortController.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (!response.ok || !response.body) {
          throw new Error(`Gemini stream returned ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const text = extractGeminiText(event);
            if (!text) continue;
            streamedText += text;
            controller.enqueue(sse({ event: "token", data: { text } }));
          }
        }

        if (buffer.trim()) {
          const text = extractGeminiText(buffer);
          if (text) {
            streamedText += text;
            controller.enqueue(sse({ event: "token", data: { text } }));
          }
        }

        const finalResponse = buildResponseFromStreamText(streamedText, fallback);
        await logAiInteraction(payload.intent, payload.message, finalResponse);
        controller.enqueue(sse({ event: "final", data: finalResponse }));
      } catch (error) {
        logServerFallback("AI Guide streaming used local fallback:", error);
        await streamFallback(controller, fallback);
      } finally {
        clearTimeout(timeout);
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}

function streamLocalResponse(response: AiResponse) {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      await streamFallback(controller, response);
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}

async function streamFallback(controller: ReadableStreamDefaultController<Uint8Array>, response: AiResponse) {
  const text = responseToStreamText(response);
  for (const chunk of chunkText(text, 18)) {
    controller.enqueue(sse({ event: "token", data: { text: chunk } }));
    await sleep(35);
  }
  controller.enqueue(sse({ event: "final", data: response }));
}

function extractGeminiText(event: string) {
  const dataLines = event
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.replace(/^data:\s?/, ""));

  if (!dataLines.length) return "";

  try {
    const payload = JSON.parse(dataLines.join("\n")) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  } catch {
    return "";
  }
}

function sse(message: StreamEvent) {
  return encoder.encode(`event: ${message.event}\ndata: ${JSON.stringify(message.data)}\n\n`);
}

function chunkText(text: string, size: number) {
  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }
  return chunks;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function logAiInteraction(intent: string, message: string, response: AiResponse) {
  if (!hasDatabaseUrl()) return;

  try {
    await prisma.aiInteraction.create({
      data: {
        intent,
        promptSummary: message.slice(0, 240),
        response,
        userId: DEMO_USER_ID
      }
    });
  } catch (error) {
    logServerFallback("Unable to log streamed AI interaction:", error);
  }
}
