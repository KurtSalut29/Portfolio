"use client";

import { usePath } from "./usePath";
import { useEffect, useState } from "react";
import { nav, type NavId } from "@/content/site";

/** Which nav section is currently in view. IntersectionObserver only, no scroll listeners. */
export function useActiveSection(): NavId | null {
  const pathname = usePath();
  const [active, setActive] = useState<NavId | null>("home");

  useEffect(() => {
    if (pathname !== "/") return;
    const els = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as NavId);
        }
      },
      // A thin band across the middle of the viewport decides the active section.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/gallery")) return "gallery";
  if (pathname !== "/") return null;
  return active;
}
