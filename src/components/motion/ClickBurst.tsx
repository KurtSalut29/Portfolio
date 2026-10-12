"use client";

import { useEffect } from "react";

const RAYS = 8;

/**
 * A small burst of rays wherever the mouse clicks: feedback that the click landed.
 * Mouse and pen only (touch already gets the platform's own feedback). Skipped for reduced motion.
 * Writes straight to the DOM, so clicking never re-renders React.
 */
export function ClickBurst() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onDown = (e: PointerEvent) => {
      if (reduce.matches || e.pointerType === "touch" || e.button !== 0) return;
      const burst = document.createElement("span");
      burst.className = "click-burst";
      burst.setAttribute("aria-hidden", "true");
      burst.style.left = `${e.clientX}px`;
      burst.style.top = `${e.clientY}px`;
      for (let i = 0; i < RAYS; i++) {
        const ray = document.createElement("i");
        ray.style.setProperty("--a", `${(360 / RAYS) * i + 22.5}deg`);
        burst.appendChild(ray);
      }
      document.body.appendChild(burst);
      burst.lastElementChild?.addEventListener("animationend", () => burst.remove(), { once: true });
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
