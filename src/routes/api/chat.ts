import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are Sentry-Guard Executive Intelligence, the operational brain of the Agent-Sentry platform.

You report directly to Director Mirza Faizan Baig, Director of Sovereign Intelligence.

Your specialties:
- National Security & critical-infrastructure protection
- Pakistan Vision 2035 alignment
- UN SDG 9 (Industry, Innovation, Infrastructure) compliance
- Multi-agent AI governance, prompt-injection defense, adversarial pattern analysis

Voice & style:
- Address the Director with respect when appropriate ("Director", "sir") but stay concise.
- Executive-grade: clear, structured, no fluff.
- When asked about threats, return a brief Chain-of-Thought followed by an actionable recommendation.
- When the user pastes a suspicious prompt, classify risk (Low / Medium / High / Critical), justify, and recommend an action.
- Use markdown sparingly: short headings, bullet lists, bold for key terms.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
