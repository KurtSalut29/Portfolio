import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { certificates } from "@/content/certificates";
import { interests, skillGroups } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";

const toolCount = new Set(skillGroups.flatMap((g) => g.items.map((i) => i.name))).size;

/** Real counts from the content files, so they stay honest as projects and certificates are added. */
const stats = [
  { value: String(projects.length), label: "Projects built" },
  { value: String(toolCount), label: "Languages and tools" },
  { value: String(certificates.length), label: "Certificates earned" },
];

const facts = [
  { label: "Based in", value: profile.facts.basedIn },
  { label: "I build", value: profile.facts.builds },
  { label: "Currently learning", value: profile.facts.learning },
  { label: "Open to", value: profile.facts.openTo },
];

/** Who Kurt is in two short paragraphs, then the numbers and a scannable fact sheet. */
export function About() {
  const [lead, ...rest] = profile.about;
  return (
    <section id="about" className="py-20 lg:py-28">
      <Container>
        <SectionHeading title="About Me" />

        <Reveal>
          <p className="mt-8 text-[1.25rem] leading-[1.6] font-medium tracking-[-0.01em] text-ink sm:text-[1.375rem]">{lead}</p>
        </Reveal>
        {rest.map((p, i) => (
          <Reveal key={i} delay={0.05 * (i + 1)}>
            <p className="mt-5 text-[1.0625rem] leading-[1.75] text-ink-2">{p}</p>
          </Reveal>
        ))}

        {/* The numbers */}
        <Reveal delay={0.1}>
          <dl className="card mt-12 grid grid-cols-3 divide-x divide-line">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-5 text-center sm:px-6 sm:py-6">
                <dd className="font-display text-[2.25rem] leading-none font-semibold tracking-[-0.04em] text-ink sm:text-5xl">
                  <CountUp value={s.value} />
                </dd>
                <dt className="mt-2.5 text-[12.5px] leading-snug text-ink-3 sm:text-[13px]">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Fact sheet: a label column and an answer column, easy to scan */}
        <Reveal delay={0.12}>
          <dl className="mt-10 border-t border-line">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[170px_1fr] sm:gap-6">
                <dt className="text-[13.5px] text-ink-3">{f.label}</dt>
                <dd className="text-[15.5px] text-ink">{f.value}</dd>
              </div>
            ))}
            <div className="grid gap-2 border-b border-line py-4 sm:grid-cols-[170px_1fr] sm:gap-6">
              <dt className="pt-1 text-[13.5px] text-ink-3">Interests</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {interests.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
