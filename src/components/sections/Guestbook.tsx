import { getGuestbook } from "@/lib/guestbook";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { GuestbookList, type ShownEntry } from "@/components/guestbook/GuestbookList";
import { GuestbookForm } from "@/components/guestbook/GuestbookForm";
import { Stars } from "@/components/guestbook/Stars";

// Dates are written out here, on the server, in Philippine time, so the browser shows exactly the same text.
const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Manila" });

/** What visitors say: the average rating, approved comments, and a form to leave one. */
export async function Guestbook() {
  const entries = await getGuestbook();
  const shown: ShownEntry[] = entries.map(({ created_at, ...e }) => ({ ...e, date: DATE.format(new Date(created_at)), iso: created_at }));
  const rated = entries.filter((e) => e.rating);
  const average = rated.length ? rated.reduce((sum, e) => sum + e.rating!, 0) / rated.length : 0;

  return (
    <section id="guestbook" className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="Guestbook."
          lead="Feedback on my work, a suggestion, or just a hello. Leave a comment and a rating if you like."
        />

        {entries.length > 0 && (
          <Reveal className="mt-10">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {rated.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="font-display text-[2.5rem] leading-none font-semibold tracking-[-0.04em] text-ink">
                    {average.toFixed(1)}
                  </span>
                  <div>
                    <Stars value={average} size={16} />
                    <p className="mt-1 text-[13px] text-ink-3">
                      Average from {rated.length} rating{rated.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              )}
              <p className="text-[14px] text-ink-2">
                {entries.length} comment{entries.length === 1 ? "" : "s"}
              </p>
            </div>
          </Reveal>
        )}

        <Reveal className="mt-6">
          {entries.length > 0 ? (
            <GuestbookList entries={shown} />
          ) : (
            <p className="mt-4 rounded-[var(--radius-card)] border border-dashed border-line-strong px-5 py-6 text-center text-[15px] text-ink-2">
              No comments yet. Be the first to leave one.
            </p>
          )}
        </Reveal>

        <Reveal className="mt-8">
          <GuestbookForm />
        </Reveal>
      </Container>
    </section>
  );
}
