/**
 * GitHub contributions from the public profile calendar (no token needed).
 * Fetched on the server and cached for 12 hours; the page rebuilds the graph after that.
 */

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; weeks: ContributionDay[][] };

const DAY_CELL = /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*\bid="([^"]+)"[^>]*\bdata-level="(\d)"[^>]*>/g;
const TOOLTIP = /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;

export async function getContributions(user: string): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github.com/users/${user}/contributions`, {
      headers: { "User-Agent": "kurtmichaelsalut.vercel.app" },
      next: { revalidate: 43200 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // "12 contributions on April 5th." / "No contributions on …"
    const counts = new Map<string, number>();
    for (const [, id, text] of html.matchAll(TOOLTIP)) {
      const n = /^(\d[\d,]*)\s+contribution/.exec(text.trim());
      counts.set(id, n ? Number(n[1].replace(/,/g, "")) : 0);
    }

    const days: ContributionDay[] = [];
    for (const [, date, id, level] of html.matchAll(DAY_CELL)) {
      days.push({ date, count: counts.get(id) ?? 0, level: Math.min(4, Number(level)) as ContributionDay["level"] });
    }
    if (days.length === 0) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));

    // Columns of Sunday-to-Saturday weeks, the way GitHub draws them.
    const weeks: ContributionDay[][] = [];
    for (const day of days) {
      const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
      if (weeks.length === 0 || weekday === 0) weeks.push([]);
      weeks[weeks.length - 1][weekday] = day;
    }
    return { total: days.reduce((sum, d) => sum + d.count, 0), weeks };
  } catch {
    return null;
  }
}
