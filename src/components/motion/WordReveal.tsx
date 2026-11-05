"use client";

import { useRef, type CSSProperties } from "react";
import { useRevealOnce } from "./useRevealOnce";

/**
 * Splits a heading into words that rise in one after another when scrolled into view.
 * Purpose: gives section titles a reading rhythm. Screen readers get the plain string.
 */
export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useRevealOnce(ref);
  const words = text.split(" ");
  return (
    <span ref={ref} className={`reveal-words ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span className="reveal-word inline-block" style={{ "--w": i } as CSSProperties}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
