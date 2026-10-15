import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { services, workflow } from "@/content/site";
import { getProject } from "@/content/projects";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { SectionLink } from "@/components/nav/SectionLink";

/** What Kurt offers, each backed by projects he has already built, then the four-step working process. */
export function Services() {
  return (
    <section id="services" className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="What I can build for you."
          lead="From the first idea to launch day. Here is what I offer, with projects where I have already done it."
        />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} delay={0.06 * i}>
              <Spotlight className="card flex h-full flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-accent-soft text-accent">
                    <Icon name={s.icon} size={20} weight="duotone" />
                  </span>
                  <h3 className="text-[1.1875rem] leading-tight font-semibold tracking-[-0.015em] text-ink">{s.title}</h3>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{s.body}</p>

                <ul className="mt-5 space-y-2">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-[14.5px] text-ink">
                      <Check size={16} strokeWidth={2.25} aria-hidden="true" className="mt-[3px] shrink-0 text-[var(--live)]" />
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* Proof: where this has been done before */}
                <div className="mt-auto pt-6">
                  <p className="border-t border-line pt-4 text-xs text-ink-3">Built before</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {s.examples.map((slug) => {
                      const p = getProject(slug);
                      return p ? (
                        <li key={slug}>
                          <Link
                            href={`/projects/${slug}`}
                            transitionTypes={["nav-forward"]}
                            className="inline-flex h-7 items-center rounded-full border border-line bg-surface-2 px-2.5 text-[12.5px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                          >
                            {p.name}
                          </Link>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </ul>

        {/* The working process: a real sequence, so the steps are numbered */}
        <Reveal className="mt-20">
          <h3 className="text-[1.625rem] font-semibold tracking-[-0.02em] text-ink sm:text-3xl">How we&apos;ll work together</h3>
          <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">Four simple steps, and you always know which one we&apos;re on.</p>
        </Reveal>
        <ol className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2">
          {workflow.map((step, i) => (
            <Reveal as="li" key={step.title} delay={0.08 * i} className="relative grid grid-cols-[auto_1fr] gap-x-4">
              <span className="grid size-9 place-items-center rounded-full border border-line-strong bg-surface font-mono text-sm font-medium text-ink">
                {i + 1}
              </span>
              <div>
                <p className="pt-1.5 font-semibold text-ink">{step.title}</p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12">
          <div className="card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-ink">Have a project in mind?</p>
              <p className="mt-1 text-[14.5px] text-ink-2">Tell me about it, and we can plan the next steps together.</p>
            </div>
            <SectionLink to="contact" className="btn btn-primary shrink-0">
              Let&apos;s talk
              <ArrowRight size={16} strokeWidth={2} className="btn-arrow" aria-hidden="true" />
            </SectionLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
