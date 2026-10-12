"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin scroll-progress line for the mobile top bar. */
export function ProgressLine() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-accent"
      style={{ scaleX: smooth }}
    />
  );
}
