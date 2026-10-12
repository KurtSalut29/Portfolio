/**
 * Hearts this month: GET reads the shared count, POST adds a batch of hearts.
 * Backed by two Supabase functions (supabase/hearts.sql). Without the env vars it answers 503
 * and the button still works, just without a count.
 */

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;

const MAX_PER_REQUEST = 20;
const MAX_PER_WINDOW = 200; // per visitor (by IP)
const WINDOW_MS = 10 * 60 * 1000;

// Best-effort, per server instance: stops one visitor from running the count up.
const hits = new Map<string, { at: number; n: number }[]>();

function allowance(ip: string, want: number) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((h) => now - h.at < WINDOW_MS);
  const used = recent.reduce((sum, h) => sum + h.n, 0);
  const n = Math.max(0, Math.min(want, MAX_PER_WINDOW - used));
  if (n > 0) recent.push({ at: now, n });
  hits.set(ip, recent);
  return n;
}

const json = (status: number, body: object) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

async function rpc(name: string, args: object = {}) {
  const res = await fetch(`${URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: KEY!, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase ${name}: ${res.status} ${await res.text()}`);
  return Number(await res.json());
}

export async function GET() {
  if (!URL || !KEY) return json(503, { error: "Hearts are not set up yet." });
  try {
    return json(200, { count: await rpc("get_hearts") });
  } catch (error) {
    console.error(error);
    return json(502, { error: "Couldn't load the count." });
  }
}

export async function POST(request: Request) {
  if (!URL || !KEY) return json(503, { error: "Hearts are not set up yet." });

  let want = 1;
  try {
    const body = (await request.json()) as { n?: unknown };
    if (typeof body.n === "number" && Number.isFinite(body.n)) want = Math.floor(body.n);
  } catch {
    // No body: one heart.
  }
  want = Math.max(1, Math.min(want, MAX_PER_REQUEST));

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const n = allowance(ip, want);
  try {
    // Over the limit: report the count without adding to it.
    return json(200, { count: n > 0 ? await rpc("add_hearts", { n }) : await rpc("get_hearts"), added: n });
  } catch (error) {
    console.error(error);
    return json(502, { error: "Couldn't save your heart." });
  }
}
