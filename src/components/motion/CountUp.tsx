"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts the leading number of `value` up from zero the first time it is seen ("3rd" -> 0rd..3rd).
 * Writes straight to the DOM, so React never re-renders per frame.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);

  useEffect(() => {
    if (!inView || !match || reduce || !ref.current) return;
    const [, num, suffix] = match;
    const el = ref.current;
    const controls = animate(0, Number(num), {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {value}
    </span>
  );
}
