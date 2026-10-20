import { SYSTEM_PROMPT } from "@/lib/chat/knowledge";

/**
 * The portfolio assistant: takes the conversation, asks Google's Gemini API, and streams the reply back
 * as plain text. The API key stays on the server (GEMINI_API_KEY in .env.local / Vercel env vars).
 * Without a key it answers 503 and the chat window shows the email address instead.
 */

const KEY = process.env.GEMINI_API_KEY;
const API = process.env.GEMINI_API_BASE ?? "https://generativelanguage.googleapis.com/v1beta";
// Free-tier models, tried in order: if one is rate limited or unavailable, the next one answers.
const MODELS = [process.env.GEMINI_MODEL, "gemini-3.5-flash-lite", "gemini-3.1-flash-lite"].filter(
  (m, i, all): m is string => !!m && all.indexOf(m) === i,
);

const MAX_MESSAGES = 12; // conversation sent to the model
const MAX_CHARS = 800; // per visitor message
const LIMIT = 20; // messages per visitor (by IP)
const WINDOW_MS = 10 * 60 * 1000;

// Best-effort, per server instance: keeps one visitor from using up the free quota.
const hits = new Map<string, number[]>();
function allowed(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return false;
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

type Message = { role: "user" | "assistant"; text: string };

const json = (status: number, error: string) =>
  Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

function parse(body: unknown): Message[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages = raw.slice(-MAX_MESSAGES).map((m) => ({
    role: m?.role === "assistant" ? "assistant" : "user",
    text: typeof m?.text === "string" ? m.text.trim().slice(0, MAX_CHARS * 3) : "",
  })) as Message[];
  const last = messages.at(-1);
  if (!last || last.role !== "user" || !last.text || last.text.length > MAX_CHARS) return null;
  return messages.filter((m) => m.text);
}

/** Opens a streaming request to the first model that accepts it. */
async function open(messages: Message[], signal: AbortSignal) {
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] })),
    generationConfig: { maxOutputTokens: 700 },
  });
  let last = 0;
  for (const model of MODELS) {
    const res = await fetch(
      `${API}/models/${model}:streamGenerateContent?alt=sse`,
      { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": KEY! }, body, signal },
    );
    if (res.ok && res.body) return res.body;
    last = res.status;
    console.error(`Gemini ${model}: ${res.status} ${(await res.text()).slice(0, 300)}`);
    // Bad request or bad key won't get better on another model.
    if (res.status === 400 || res.status === 401 || res.status === 403) break;
  }
  throw Object.assign(new Error("No model answered"), { status: last });
}

/** Gemini's SSE events → just the reply text. */
function textOnly(upstream: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  return upstream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, out) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          try {
            const event = JSON.parse(line.slice(5));
            const parts: { text?: string; thought?: boolean }[] = event?.candidates?.[0]?.content?.parts ?? [];
            const text = parts.filter((p) => !p.thought && p.text).map((p) => p.text).join("");
            if (text) out.enqueue(encoder.encode(text));
          } catch {
            // A partial or keep-alive line; skip it.
          }
        }
      },
    }),
  );
}

export async function POST(request: Request) {
  if (!KEY) return json(503, "The assistant isn't set up yet.");

  // Only this site's pages may use the assistant.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) return json(403, "Not allowed.");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowed(ip)) return json(429, "That's a lot of questions! Please wait a few minutes and try again.");

  let messages: Message[] | null = null;
  try {
    messages = parse(await request.json());
  } catch {}
  if (!messages) return json(400, `Please send a message under ${MAX_CHARS} characters.`);

  try {
    const stream = await open(messages, request.signal);
    return new Response(textOnly(stream), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (error) {
    const status = (error as { status?: number }).status;
    if (status === 429) return json(429, "The assistant is busy right now. Please try again in a minute.");
    return json(502, "The assistant couldn't answer right now.");
  }
}
