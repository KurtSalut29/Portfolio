import { activity } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { JourneyTrail } from "./JourneyTrail";

const TITLE = "My journey so far."
const LEAD = "Every project taught me something new. Here is where I have been, and where I am headed next.";

export function Journey() {
  return (
    <section id="journey" className="py-20 lg:py-28">
      <Container>
        <SectionHeading title={TITLE} lead={LEAD} />
        <div className="mt-12">
          <JourneyTrail />
        </div>
      </Container>

      <Container className="mt-16">
        <Reveal className="card grid gap-5 p-6">
          <p className="text-sm font-medium text-ink">Latest activity</p>
          <ul className="grid gap-5 sm:grid-cols-3">
            {activity.map((a) => (
              <li key={a.title + a.date} className="grid grid-cols-[auto_1fr] gap-x-3">
                <span className="mt-1.5 size-2 rounded-full border-2 border-accent" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-ink">
                    {a.title} <span className="font-normal text-ink-2">{a.body}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-3">{a.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
