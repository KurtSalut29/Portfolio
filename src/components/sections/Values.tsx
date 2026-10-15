import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { values } from "@/content/site";
import { projects, getProject } from "@/content/projects";
import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLink } from "@/components/nav/SectionLink";
import { Spotlight } from "@/components/motion/Spotlight";
import { WordReveal } from "@/components/motion/WordReveal";

// Quick facts for the statement card, read from the project list so they stay true.
const since = Math.min(...projects.map((p) => Number(p.year)).filter(Boolean));
const led = projects.find((p) => p.role?.toLowerCase().includes("lead") && p.team);
const facts = [
  { value: String(since), label: "Writing software since" },
  { value: "Web + mobile", label: "Apps I build end to end" },
  ...(led ? [{ value: led.team!, label: "Led as lead developer" }] : []),
];

/** A statement card with quick facts, then one card per value, each pointing at where it shows. */
export function Values() {
  return (
    <section aria-labelledby="values-title" className="py-14 lg:py-20">
      <Container>
        <ul className="grid gap-3 sm:grid-cols-2">
          <Reveal
            as="li"
            className="relative isolate overflow-hidden rounded-[var(--radius-card)] bg-accent p-7 text-accent-ink sm:col-span-2 sm:p-8"
          >
            {/* Soft light in the corner so the block isn't a flat slab */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.16),transparent)]"
            />
            <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase opacity-70">Why work with me</p>
            <h2
              id="values-title"
              className="mt-3 max-w-[16ch] text-[2.25rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-[2.75rem]"
            >
              <WordReveal text="What I bring to your team." />
            </h2>
            <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed opacity-85">
              Good software is more than code that runs. It should be easy to use, easy to change, and delivered with
              clear updates along the way. Here is what you get when we work together.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <SectionLink
                to="contact"
                className="btn bg-accent-ink text-accent hover:bg-[color-mix(in_oklab,var(--accent-ink)_88%,var(--accent))]"
              >
                Let&apos;s talk
                <ArrowRight size={16} strokeWidth={2} className="btn-arrow" aria-hidden="true" />
              </SectionLink>
              <SectionLink
                to="projects"
                className="btn border border-[color-mix(in_oklab,var(--accent-ink)_35%,transparent)] hover:border-accent-ink"
              >
                See my projects
              </SectionLink>
            </div>

            <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-[color-mix(in_oklab,var(--accent-ink)_22%,transparent)] pt-6 min-[480px]:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="mt-1.5 text-[13px] leading-snug opacity-70">{f.label}</dt>
                  <dd className="font-display text-[1.375rem] leading-none font-semibold tracking-[-0.02em]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {values.map((v, i) => (
            <Reveal as="li" key={v.title} delay={0.05 * (i + 1)}>
              <Spotlight className="group card flex h-full flex-col p-6 transition-[border-color,transform] duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-line-strong">
                <span className="grid size-11 place-items-center rounded-[var(--radius-control)] bg-accent-soft text-accent transition-transform duration-300 ease-[var(--ease-out)] group-hover:-rotate-6 group-hover:scale-110">
                  <Icon name={v.icon} size={22} weight="duotone" />
                </span>
                <h3 className="mt-5 text-lg leading-snug font-semibold tracking-tight text-ink">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{v.body}</p>

                {/* Proof: where this shows */}
                <div className="mt-auto pt-6">
                  {"href" in v.proof ? (
                    <a
                      href={v.proof.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 border-t border-line pt-4 text-[13.5px] font-medium text-ink-2 transition-colors hover:text-ink"
                    >
                      <Icon name="github" size={16} />
                      {v.proof.label}
                      <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" className="text-ink-3" />
                    </a>
                  ) : (
                    <>
                      <p className="border-t border-line pt-4 text-xs text-ink-3">Where it shows</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {v.proof.projects.map((slug) => {
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
                    </>
                  )}
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
