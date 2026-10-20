import { GUESTBOOK_LIMITS as LIMITS } from "@/lib/guestbook";

/**
 * New guestbook comments. They are saved as unapproved and only appear on the site once Kurt approves
 * them in Supabase, so this route only has to keep out bots and floods, not judge content.
 */

const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;

const PER_WINDOW = 3; // comments per visitor (by IP)
const WINDOW_MS = 10 * 60 * 1000;
const MIN_FILL_MS = 3000; // a person takes longer than this to write a comment

const hits = new Map<string, number[]>();
function allowed(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_WINDOW) return false;
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

const json = (status: number, body: object) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const text = (v: unknown) => (typeof v === "string" ? v.trim().replace(/\s+\n/g, "\n") : "");

export async function POST(request: Request) {
  if (!URL_ || !KEY) return json(503, { error: "Comments aren't set up yet." });

  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) return json(403, { error: "Not allowed." });

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {}

  // Bots fill the hidden field or submit instantly. Pretend it worked, so they don't retry.
  if (text(body.website) || typeof body.elapsed !== "number" || body.elapsed < MIN_FILL_MS) return json(200, { ok: true });

  const name = text(body.name);
  const role = text(body.role);
  const message = text(body.message);
  const rating = typeof body.rating === "number" && body.rating >= 1 && body.rating <= 5 ? Math.round(body.rating) : null;

  if (!name || name.length > LIMITS.name) return json(400, { error: `Please add your name (up to ${LIMITS.name} characters).` });
  if (role.length > LIMITS.role) return json(400, { error: `Keep the role or company under ${LIMITS.role} characters.` });
  if (message.length < 2 || message.length > LIMITS.message)
    return json(400, { error: `Please write a comment (up to ${LIMITS.message} characters).` });
  if ((message.match(/https?:\/\/|www\./gi) ?? []).length > 1) return json(400, { error: "Please include at most one link." });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowed(ip)) return json(429, { error: "You've posted a few comments already. Please try again later." });

  try {
    const res = await fetch(`${URL_}/rest/v1/rpc/add_guestbook`, {
      method: "POST",
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_name: name, p_role: role || null, p_message: message, p_rating: rating }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Supabase add_guestbook: ${res.status} ${await res.text()}`);
    return json(200, { ok: true });
  } catch (error) {
    console.error(error);
    return json(502, { error: "Couldn't save your comment. Please try again." });
  }
}
