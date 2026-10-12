"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useScrollToSection } from "@/components/nav/SectionLink";

/**
 * Sticky contents for a case study. The active entry follows the section in view,
 * and a thin line fills with reading progress (state indication).
 */
export function CaseToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const scrollTo = useScrollToSection();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-35% 0px -55% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  return (
    <nav aria-label="On this page" className="sticky top-10">
      <p className="label-mono">On this page</p>
      <div className="relative mt-4 pl-4">
        <span className="absolute top-0 bottom-0 left-0 w-px bg-line" aria-hidden="true" />
        <motion.span
          className="absolute top-0 bottom-0 left-0 w-px origin-top bg-accent"
          style={{ scaleY: progress }}
          aria-hidden="true"
        />
        <ul className="space-y-2.5">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(i.id);
                }}
                aria-current={active === i.id ? "location" : undefined}
                className={`block text-sm transition-colors duration-200 ${
                  active === i.id ? "font-medium text-ink" : "text-ink-3 hover:text-ink-2"
                }`}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
