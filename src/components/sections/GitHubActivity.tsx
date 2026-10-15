import { ArrowUpRight } from "lucide-react";
import { getContributions, type ContributionDay } from "@/lib/github";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/motion/Reveal";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ROW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const github = profile.socials.find((s) => s.icon === "github")?.href ?? "";
const username = github.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");

function describe(day: ContributionDay) {
  const date = new Date(`${day.date}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
  if (day.count === 0) return `No contributions on ${date}`;
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${date}`;
}

/** A month label above the first week that starts in that month. */
function monthLabels(weeks: ContributionDay[][]) {
  let last = -1;
  return weeks.map((week) => {
    const first = week.find(Boolean);
    if (!first) return "";
    const m = Number(first.date.slice(5, 7)) - 1;
    if (m === last) return "";
    last = m;
    return MONTHS[m];
  });
}

/** The past year of GitHub activity as the familiar grid of squares. Hidden if GitHub can't be reached. */
export async function GitHubActivity() {
  if (!username) return null;
  const data = await getContributions(username);
  if (!data) return null;
  const labels = monthLabels(data.weeks);

  return (
    <Reveal className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium text-ink">
          <span className="font-mono tabular-nums">{data.total.toLocaleString("en-US")}</span> contributions in the last year
        </p>
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[13px] text-ink-3 transition-colors hover:text-ink"
        >
          @{username}
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>

      {/* Scrolls sideways on small screens, starting at the most recent weeks */}
      <div className="gh-scroll mt-4 overflow-x-auto pb-1 [direction:rtl]">
        <div className="inline-grid grid-cols-[auto_1fr] gap-x-2 [direction:ltr]">
          <span aria-hidden="true" />
          <div className="gh-months grid font-mono text-[10px] text-ink-3" aria-hidden="true">
            {labels.map((l, i) => (
              <span key={i} className="whitespace-nowrap">
                {l}
              </span>
            ))}
          </div>

          <div className="gh-days grid font-mono text-[10px] leading-none text-ink-3" aria-hidden="true">
            {ROW_LABELS.map((l, i) => (
              <span key={i} className="flex items-center">
                {l}
              </span>
            ))}
          </div>
          <ul className="gh-grid grid" aria-label={`GitHub contributions for ${username} over the last year`}>
            {data.weeks.flatMap((week, w) =>
              Array.from({ length: 7 }, (_, d) => {
                const day = week[d];
                return day ? (
                  <li
                    key={day.date}
                    title={describe(day)}
                    aria-label={describe(day)}
                    data-level={day.level}
                    className="gh-cell"
                    style={{ gridColumn: w + 1, gridRow: d + 1 }}
                  />
                ) : (
                  <li key={`${w}-${d}`} aria-hidden="true" style={{ gridColumn: w + 1, gridRow: d + 1 }} />
                );
              }),
            )}
          </ul>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-ink-3" aria-hidden="true">
        Less
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="gh-cell inline-block" data-level={l} />
        ))}
        More
      </div>
    </Reveal>
  );
}
