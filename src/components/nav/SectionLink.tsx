"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
      lenis.scrollTo(el, { offset, force: true, duration: 1.1 });
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
  const onHome = usePathname() === "/";
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
