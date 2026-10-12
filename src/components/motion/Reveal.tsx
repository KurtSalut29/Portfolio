"use client";

import { motion, type HTMLMotionProps } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * Fades and lifts content into place the first time it scrolls into view.
 * Purpose: pace the reading order so each section arrives as one idea.
 */
export function Reveal({
  delay = 0,
  y = 18,
  as = "div",
  children,
  ...rest
}: {
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article" | "section";
} & HTMLMotionProps<"div">) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
