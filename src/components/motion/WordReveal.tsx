"use client";

import { motion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * Splits a heading into words that rise in one after another when scrolled into view.
 * Purpose: gives section titles a reading rhythm. Screen readers get the plain string.
 */
export function WordReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: 0.06 }}
    >
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { opacity: 0, transform: "translateY(60%)" },
              shown: { opacity: 1, transform: "translateY(0%)", transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
