import {
  BookOpenTextIcon,
  CrosshairIcon,
  HammerIcon,
  MapPinIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { interests, skillGroups } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { Spotlight } from "@/components/motion/Spotlight";
import { certificates } from "@/content/certificates";

const toolCount = skillGroups.reduce((n, g) => n + g.items.length, 0);

/** Real counts derived from your content, so they stay honest as you edit. */
const facts = [
  { value: String(projects.length), label: "Projects shipped or in progress" },
  { value: `${toolCount}`, label: "Languages, frameworks, and tools" },
  { value: String(certificates.length), label: "Certifications and awards" },
];

export function About() {
  const info = [
    { icon: MapPinIcon, label: "Location", value: profile.location },
    { icon: SparkleIcon, label: "Status", value: profile.availability.label },
    { icon: CrosshairIcon, label: "Focus", value: profile.focus.join(", ") },
  ];
  const now = [
    { icon: HammerIcon, label: "Focused on", value: profile.now.focus },
    { icon: BookOpenTextIcon, label: "Learning", value: profile.now.learning },
  ];

  return (
    <section id="about" className="py-20 lg:py-28">
      <Container className="grid gap-12">
        <div>
          <SectionHeading title="A little about me." />
          <div className="mt-8 max-w-[62ch] space-y-5 text-[1.0625rem] leading-relaxed text-ink-2 sm:text-lg">
            {profile.about.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-display text-5xl font-semibold tracking-[-0.04em] text-ink sm:text-6xl">
                    <CountUp value={f.value} />
                  </dd>
                  <dd className="mt-2 max-w-[18ch] text-[13px] leading-snug text-ink-3">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.15} className="mt-10">
            <p className="text-sm font-medium text-ink">Interests</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {interests.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Reveal>
            <Spotlight className="card h-full p-6">
              <p className="flex items-center justify-between text-sm font-medium text-ink">
                Now
                <span className="flex items-center gap-1.5 text-xs font-normal text-ink-3">
                  <span className="status-dot" aria-hidden="true" />
                  Live
                </span>
              </p>
              <ul className="mt-5 space-y-4">
                {now.map(({ icon: I, label, value }) => (
                  <li key={label} className="flex gap-3.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
                      <I size={18} weight="duotone" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs text-ink-3">{label}</p>
                      <p className="mt-0.5 text-sm leading-snug text-ink">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Spotlight>
          </Reveal>

          <Reveal delay={0.05}>
            <Spotlight className="card h-full p-6">
              <p className="text-sm font-medium text-ink">Quick info</p>
              <ul className="mt-5 space-y-5">
                {info.map(({ icon: I, label, value }) => (
                  <li key={label} className="flex gap-3.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface-2 text-ink-2">
                      <I size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs text-ink-3">{label}</p>
                      <p className="mt-0.5 text-sm leading-snug text-ink">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Spotlight>
          </Reveal>

          <Reveal delay={0.1} className="card relative isolate flex flex-col overflow-hidden p-6 sm:col-span-2">
            <blockquote className="relative z-10">
              <p className="font-display text-xl leading-snug font-medium tracking-tight text-ink">
                &ldquo;{profile.quote.text}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-ink-3">{profile.quote.author}</footer>
            </blockquote>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
