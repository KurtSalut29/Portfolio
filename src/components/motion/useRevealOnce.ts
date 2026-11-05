"use client";

import { useEffect, type RefObject } from "react";

let observer: IntersectionObserver | null = null;

function reveal(el: Element) {
  (el as HTMLElement).dataset.shown = "";
  observer?.unobserve(el);
}

/** One observer shared by every element on the page. */
function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // Also counts anything already scrolled past, such as after jumping to a section.
        if (e.isIntersecting || e.boundingClientRect.bottom < 0) reveal(e.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  return observer;
}

/**
 * Marks an element with data-shown the first time it scrolls into view. CSS does the animating, so
 * it stays smooth while the page is busy, and React never re-renders for it.
 */
export function useRevealOnce(ref: RefObject<Element | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, [ref]);
}
