"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import { ClickBurst } from "@/components/motion/ClickBurst";

/** The sidebar list gets the wheel only when it has links to scroll to; otherwise the page scrolls. */
const scrollsOnItsOwn = (node: HTMLElement) =>
  node.classList.contains("sidebar-scroll") && node.scrollHeight > node.clientHeight + 1;

function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  // Smooth scrolling is movement: skip it entirely for reduced-motion users.
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -16 }, prevent: scrollsOnItsOwn }}>
      {children}
    </ReactLenis>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <ClickBurst />
        <SmoothScroll>{children}</SmoothScroll>
      </MotionConfig>
    </ThemeProvider>
  );
}
