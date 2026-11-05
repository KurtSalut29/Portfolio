"use client";

import { useRef, type ComponentPropsWithoutRef, type CSSProperties, type ElementType } from "react";
import { useRevealOnce } from "./useRevealOnce";

/**
 * Fades and lifts content into place the first time it scrolls into view.
 * Purpose: pace the reading order so each section arrives as one idea.
 */
export function Reveal({
  delay = 0,
  y = 32,
  as = "div",
  className = "",
  style,
  children,
  ...rest
}: {
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article" | "section";
} & ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLElement>(null);
  useRevealOnce(ref);
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-y": `${y}px`, "--reveal-delay": `${delay}s`, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
