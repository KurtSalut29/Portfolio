"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { ClickBurst } from "@/components/motion/ClickBurst";

/** The sidebar list gets the wheel only when it has links to scroll to; otherwise the page scrolls. */
const scrollsOnItsOwn = (node: HTMLElement) =>
  node.classList.contains("sidebar-scroll") && node.scrollHeight > node.clientHeight + 1;

/** Holds smooth scrolling while the intro plays, so the page can't move under the curtain. */
function HoldDuringIntro() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const root = document.documentElement;
    const sync = () => (root.dataset.intro === "playing" ? lenis.stop() : lenis.start());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
    return () => mo.disconnect();
  }, [lenis]);
  return null;
}

function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  // Smooth scrolling is movement: skip it entirely for reduced-motion users.
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -16 }, prevent: scrollsOnItsOwn }}>
      <HoldDuringIntro />
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
