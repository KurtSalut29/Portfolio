"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { useLenis } from "lenis/react";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectMedia } from "@/components/projects/ProjectMedia";

const shown = projects.filter((p) => p.featured);
/** Cards shown before "Show all", so the section keeps its length as projects are added. */
const INITIAL_DESKTOP = 6;
const INITIAL_PHONE = 4;
/** Matches .more-projects in globals.css, plus a little to let it settle. */
const CLOSE_MS = 380;

function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      transitionTypes={["nav-forward"]}
      className="group block transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.985] motion-reduce:transform-none"
    >
      <ProjectMedia
        project={p}
        compact
        className="transition-[border-color] duration-300 group-hover:border-line-strong"
      />
      <span className="mt-3.5 flex items-baseline justify-between gap-3">
        <h3 className="inline-flex min-w-0 items-center gap-1 font-sans text-[1.0625rem] font-medium tracking-[-0.01em] text-ink">
          <span className="truncate">{p.name}</span>
          <ArrowUpRight
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className="shrink-0 text-ink-3 opacity-0 transition-[opacity,transform,scale,translate] duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 motion-reduce:transform-none"
          />
        </h3>
        {p.year && <span className="shrink-0 text-sm text-ink-3 tabular-nums">{p.year}</span>}
      </span>
      <span className="mt-0.5 block truncate text-sm text-ink-2">{p.short}</span>
      {p.stack.length > 0 && <span className="mt-1 block truncate text-[13px] text-ink-3">{p.stack.join(", ")}</span>}
    </Link>
  );
}

/**
 * The projects as a gallery of real screenshots, so the work is the first thing a visitor sees.
 * Extra projects wait behind "Show all", which keeps the page length steady as the list grows.
 */
export function FeaturedProjects() {
  const [showAll, setShowAll] = useState(false);
  // The extra cards mount the first time they open, so their screenshots aren't downloaded before then.
  const [opened, setOpened] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  const toggleAll = () => {
    if (showAll) {
      // The cards above fold away while the button stays under the pointer, so the page never jumps.
      const anchor = button.current?.getBoundingClientRect().top ?? 0;
      let start: number | undefined;
      const pin = (now: number) => {
        start ??= now;
        const drift = (button.current?.getBoundingClientRect().top ?? anchor) - anchor;
        if (Math.abs(drift) > 0.5) {
          if (lenis) lenis.scrollTo(lenis.scroll + drift, { immediate: true, force: true });
          else window.scrollBy(0, drift);
        }
        if (now - start < CLOSE_MS) requestAnimationFrame(pin);
      };
      requestAnimationFrame(pin);
    }
    setOpened(true);
    setShowAll(!showAll);
  };

  const phoneExtras = shown.slice(INITIAL_PHONE, INITIAL_DESKTOP);
  const desktopExtras = shown.slice(INITIAL_DESKTOP);

  return (
    <section id="projects" className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          title="Ideas, turned into software."
          lead="Client work, team builds, and personal projects, each one made to solve a real problem."
        />

        <ul className="mt-10 grid gap-x-5 gap-y-9 sm:grid-cols-2">
          {shown.slice(0, INITIAL_DESKTOP).map((p, i) => (
            <Reveal
              as="li"
              key={p.slug}
              y={44}
              delay={(i % 2) * 0.12}
              className={i >= INITIAL_PHONE ? "max-sm:hidden" : ""}
            >
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </ul>

        {shown.length > INITIAL_PHONE && (
          <>
            <div id="more-projects" data-open={showAll} inert={!showAll} className="more-projects">
              <div className="min-h-0 overflow-hidden">
                {opened && (
                  <ul className="grid gap-x-5 gap-y-9 pt-9 sm:grid-cols-2">
                    {/* On phones these two were hidden above; on wider screens they already show. */}
                    {phoneExtras.map((p, i) => (
                      <li key={p.slug} className="more-card sm:hidden" style={{ "--i": i } as CSSProperties}>
                        <ProjectCard project={p} />
                      </li>
                    ))}
                    {desktopExtras.map((p, i) => (
                      <li key={p.slug} className="more-card" style={{ "--i": i } as CSSProperties}>
                        <ProjectCard project={p} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button
              ref={button}
              type="button"
              onClick={toggleAll}
              aria-expanded={showAll}
              aria-controls="more-projects"
              // With six or fewer, wider screens already show every card.
              className={`btn btn-secondary mt-9 h-11 w-full text-sm ${shown.length <= INITIAL_DESKTOP ? "sm:hidden" : ""}`}
            >
              {showAll ? "Show fewer" : `Show all ${shown.length} projects`}
            </button>
          </>
        )}
      </Container>
    </section>
  );
}
