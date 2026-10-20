/**
 * Guestbook data: approved comments from Supabase (supabase/guestbook.sql).
 * Read on the server and cached for 5 minutes, so an approved comment shows up shortly after.
 */

export type Entry = { id: number; name: string; role: string | null; message: string; rating: number | null; created_at: string };

export const GUESTBOOK_LIMITS = { name: 60, role: 80, message: 600 } as const;

export async function getGuestbook(): Promise<Entry[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/rpc/get_guestbook`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 300, tags: ["guestbook"] },
    });
    // 404: the function doesn't exist yet. Not a crash, just a setup step, so a note instead of an error.
    if (res.status === 404) {
      console.warn("Guestbook isn't set up yet: run supabase/guestbook.sql in the Supabase SQL Editor.");
      return [];
    }
    if (!res.ok) throw new Error(`Supabase get_guestbook: ${res.status} ${await res.text()}`);
    return (await res.json()) as Entry[];
  } catch (error) {
    // Supabase is down or unreachable: the section still shows the form.
    console.error(error);
    return [];
  }
}
