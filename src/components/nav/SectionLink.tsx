"use client";

import Link from "next/link";
import { usePath } from "./usePath";
import { useLenis } from "lenis/react";
import type { ComponentPropsWithoutRef } from "react";

/** Scrolls to a section, clearing the mobile top bar. Works with or without Lenis. */
export function useScrollToSection() {
  const lenis = useLenis();
  return (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = window.innerWidth < 1024 ? -76 : -16;
    if (lenis) {
      // Eases in and out, and takes a little longer for longer trips, so a jump reads as one glide.
      const distance = Math.abs(el.getBoundingClientRect().top + offset);
      lenis.scrollTo(el, {
        offset,
        force: true,
        duration: Math.min(1.4, 0.6 + distance / 4000),
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      });
    } else {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }
    history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
  };
}

/** In-page link to a section id. Off the home page it navigates to /#id. */
export function SectionLink({
  to,
  onNavigate,
  children,
  ...rest
}: { to: string; onNavigate?: () => void } & Omit<ComponentPropsWithoutRef<"a">, "href">) {
  const onHome = usePath() === "/";
  const scrollTo = useScrollToSection();

  if (!onHome) {
    return (
      <Link href={`/#${to}`} transitionTypes={["nav-back"]} onClick={onNavigate} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.();
        scrollTo(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
