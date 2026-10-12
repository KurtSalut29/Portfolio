"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { RocketLaunchIcon } from "@phosphor-icons/react/dist/ssr";
import { journey } from "@/content/site";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * Vertical timeline whose line fills as you scroll.
 * Purpose: tells the story in order, one milestone at a time.
 */
export function JourneyTrail() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  return (
    <ol ref={ref} className="relative">
      {/* Track + fill. scaleY keeps it on the compositor. */}
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-px bg-line-strong" />
      <motion.span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[11px] w-px origin-top bg-accent"
        style={{ scaleY: reduce ? 1 : progress }}
      />
      {journey.map((step, i) => {
        const upcoming = "upcoming" in step && step.upcoming;
        return (
          <motion.li
            key={step.title}
            className="relative pb-10 pl-12 last:pb-0"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
          >
            <span
              className={`absolute top-0.5 left-0 grid size-6 place-items-center rounded-full border ${
                upcoming ? "border-accent bg-accent text-accent-ink" : "border-line-strong bg-bg"
              }`}
            >
              {upcoming ? (
                <RocketLaunchIcon size={12} weight="fill" aria-hidden="true" />
              ) : (
                <span className="size-2 rounded-full bg-accent" />
              )}
            </span>
            <p className="label-mono">{step.date}</p>
            <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">{step.title}</h3>
            <p className={`mt-2 max-w-[52ch] text-[15px] leading-relaxed ${upcoming ? "text-ink" : "text-ink-2"}`}>
              {step.body}
            </p>
            {i === journey.length - 1 && upcoming && (
              <p className="mt-4 inline-flex rounded-full bg-accent-soft px-3 py-1 text-[13px] font-medium text-accent">
                This is where you come in.
              </p>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}
