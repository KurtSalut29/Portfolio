"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * Cycles through words in place. Every word is laid out invisibly in the same grid cell,
 * so the line never reflows when the visible word changes. Pauses on hover/focus.
 */
export function RotatingWord({
  words,
  interval = 2600,
  className = "",
}: {
  words: readonly string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [reduce, paused, interval, words.length]);

  return (
    <span
      className={`relative inline-grid align-bottom ${className}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <span className="sr-only">{words.join(", ")}</span>
      {words.map((w) => (
        <span key={w} aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {w}
        </span>
      ))}
      <span aria-hidden="true" className="col-start-1 row-start-1 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={words[i]}
            className="block whitespace-nowrap"
            initial={{ opacity: 0, transform: "translateY(90%)", filter: "blur(4px)" }}
            animate={{ opacity: 1, transform: "translateY(0%)", filter: "blur(0px)" }}
            exit={{ opacity: 0, transform: "translateY(-90%)", filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
