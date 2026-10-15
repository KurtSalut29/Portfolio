"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { DeviceStage } from "@/components/mockups/DeviceStage";
import { PLATFORM } from "@/components/mockups/platform";
import { ScreenshotViewer } from "@/components/mockups/ScreenshotViewer";

const featured = projects.filter((p) => p.featured);
const SANS = {
  fontFamily: "var(--font-geist-sans), ui-sans-serif, sans-serif",
};
const pad = (n: number) => String(n).padStart(2, "0");


function Slide({
  project: p,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const platform = PLATFORM[p.platform];
  return (
    <article
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${p.name}`}
    >
      <div className="relative">
        <Link
          href={`/projects/${p.slug}`}
          transitionTypes={["nav-forward"]}
          aria-label={`View project: ${p.name}`}
          draggable={false}
          className="group relative block aspect-[16/11] overflow-hidden rounded-[var(--radius-card)] border border-line transition-[border-color] duration-300 hover:border-line-strong"
          style={{
            background: `radial-gradient(70% 55% at 50% 105%, ${p.cover.glow}38, transparent 72%), linear-gradient(180deg, var(--surface), var(--surface-2))`,
          }}
        >
          <DeviceStage project={p} />
        </Link>
        <ScreenshotViewer project={p} />
      </div>

      <p className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-ink-3">
        <span className="inline-flex items-center gap-1.5 font-medium text-ink-2">
          <platform.icon size={15} strokeWidth={1.75} aria-hidden="true" />
          {platform.label}
        </span>
        {[p.year, p.status].filter(Boolean).map((v) => (
          <span key={v} className="contents">
            <span aria-hidden="true">·</span>
            {v}
          </span>
        ))}
      </p>

      <h3
        className="mt-3 text-2xl leading-snug font-medium tracking-[-0.015em] text-ink"
        style={SANS}
      >
        {p.name} <span className="text-ink-3">— {p.short}</span>
      </h3>
      <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-2">
        {p.summary}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Highlights">
        {p.badges.map((b) => (
          <li key={b} className="chip">
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <Link
          href={`/projects/${p.slug}`}
          transitionTypes={["nav-forward"]}
          className="group/cta inline-flex items-center gap-1.5 font-medium text-ink"
        >
          <span className="link-underline">View project</span>
          <ArrowRight
            size={15}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-200 ease-[var(--ease-out)] group-hover/cta:translate-x-0.5"
          />
        </Link>
        {p.links?.live && (
          <a
            href={p.links.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-ink-2 hover:text-ink"
          >
            <span className="link-underline">Live site</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
        {p.links?.repo && (
          <a
            href={p.links.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-ink-2 hover:text-ink"
          >
            <span className="link-underline">Source on GitHub</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}

const arrowBtn =
  "grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-ink-2 transition-[transform,color,border-color,opacity] duration-150 hover:border-ink-3 hover:text-ink active:scale-95 disabled:pointer-events-none disabled:opacity-35";

/**
 * Projects side by side in a horizontal track, one per slide, with the next one peeking in.
 * The page stays the same length however many projects there are.
 * Move with the arrows, the dots, a swipe or trackpad, or the arrow keys.
 */
export function FeaturedProjects() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const n = featured.length;

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      const slide = el?.children[Math.max(0, Math.min(n - 1, i))] as
        HTMLElement | undefined;
      if (!el || !slide) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      el.scrollTo({
        left: slide.offsetLeft - el.offsetLeft,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [n],
  );

  // The current slide is whichever one is mostly in view.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting)
            setIndex(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { root: el, threshold: 0.6 },
    );
    Array.from(el.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section id="projects" className="py-14 lg:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            title="Ideas, turned into software."
            lead="Client work, team builds, and personal projects, each one made to solve a real problem."
          />
          <div className="flex items-center gap-3">
            <p
              className="font-mono text-xs text-ink-3 tabular-nums"
              aria-live="polite"
            >
              <span className="text-ink">{pad(index + 1)}</span> / {pad(n)}
            </p>
            <div
              className="flex gap-2"
              role="group"
              aria-label="Carousel controls"
            >
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label="Previous project"
                className={arrowBtn}
              >
                <ChevronLeft size={18} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={index === n - 1}
                aria-label="Next project"
                className={arrowBtn}
              >
                <ChevronRight size={18} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        <Reveal className="mt-10">
          <div
            ref={track}
            role="region"
            aria-roledescription="carousel"
            aria-label="Projects"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                goTo(index + 1);
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                goTo(index - 1);
              }
            }}
            className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
          >
            {featured.map((p, i) => (
              <div
                key={p.slug}
                data-index={i}
                // Each slide is a little narrower than the column so the next one peeks in.
                className="w-[88%] shrink-0 snap-start last:mr-[12%]"
              >
                <Slide project={p} index={i} total={n} />
              </div>
            ))}
          </div>
        </Reveal>

        <div
          className="mt-8 flex justify-center gap-1"
          role="group"
          aria-label="Choose a project"
        >
          {featured.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${p.name}`}
              aria-current={i === index || undefined}
              className="grid size-6 place-items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out)] ${
                  i === index
                    ? "w-5 bg-ink"
                    : "w-1.5 bg-line-strong hover:bg-ink-3"
                }`}
              />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
