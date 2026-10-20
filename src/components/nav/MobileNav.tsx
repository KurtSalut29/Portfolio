"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { Ellipsis, X } from "lucide-react";
import { profile } from "@/content/profile";
import { nav, type NavId } from "@/content/site";
import { gallery } from "@/content/gallery";
import { COUNTS, ICONS, NavLink, type Item } from "./NavList";
import { useActiveSection } from "./useActiveSection";
import { SocialLinks } from "./SocialLinks";
import { NavActions } from "./NavActions";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { ProgressLine } from "./ScrollProgress";

const SHEET_EASE = [0.32, 0.72, 0, 1] as const;

/** Thumb-reach tabs; everything else lives under More. */
const PRIMARY: NavId[] = ["home", "projects", "about", "contact"];

const items = nav.filter((n) => n.id !== "gallery" || gallery.length > 0) as readonly Item[];
const primary = PRIMARY.map((id) => items.find((n) => n.id === id)!).filter(Boolean);
const more = items.filter((n) => !PRIMARY.includes(n.id));

const tab =
  "relative flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium transition-colors duration-200";

/** The active tab's highlight hugs the icon only, so the label below stays clear. */
function TabIcon({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span className={`relative grid h-7 w-12 place-items-center ${on ? "text-accent" : ""}`}>
      {on && (
        <motion.span
          layoutId="tab-pill"
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-accent-soft"
          transition={{ type: "spring", duration: 0.4, bounce: 0.18 }}
        />
      )}
      <span className="relative">{children}</span>
    </span>
  );
}

/** Below lg: a slim top bar (name, theme, reading progress) and a floating bottom tab bar. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const lenis = useLenis();
  const moreActive = more.some((m) => m.id === active);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const close = () => setOpen(false);

  return (
    <div className="no-print lg:hidden">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-bg/80 px-4 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${profile.fullName}, home`}>
          <span className="relative h-[22px] w-[33px] shrink-0">
            <Image src="/brand/km-mark-light.png" alt="" fill unoptimized className="object-contain dark:hidden" />
            <Image src="/brand/km-mark-dark.png" alt="" fill unoptimized className="hidden object-contain dark:block" />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.015em] text-ink">{profile.fullName}</span>
        </Link>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <ThemeToggle />
        </div>
        <ProgressLine />
      </header>

      {/* Bottom tab bar */}
      <nav
        aria-label="Main"
        className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 flex h-16 items-stretch rounded-[22px] border border-line bg-surface/90 px-1.5 shadow-[var(--card-shadow-lift)] backdrop-blur-xl"
      >
        {primary.map((item) => {
          const Icon = ICONS[item.id];
          const on = active === item.id && !open;
          return (
            <NavLink
              key={item.id}
              item={item}
              aria-current={on ? "page" : undefined}
              className={`${tab} ${on ? "text-ink" : "text-ink-3"}`}
            >
              <TabIcon on={on}>
                <Icon size={20} strokeWidth={on ? 2.1 : 1.75} aria-hidden="true" />
              </TabIcon>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          data-sound={open ? "close" : "open"}
          aria-expanded={open}
          aria-controls="more-sheet"
          className={`${tab} ${open || moreActive ? "text-ink" : "text-ink-3"}`}
        >
          <TabIcon on={open || moreActive}>
            <Ellipsis size={20} strokeWidth={2} aria-hidden="true" />
          </TabIcon>
          <span>More</span>
        </button>
      </nav>

      {/* More: a sheet rising from the bar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-30 bg-ink/25 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              onClick={close}
            />
            <motion.div
              key="sheet"
              id="more-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="More"
              data-lenis-prevent
              className="fixed inset-x-3 bottom-[calc(max(12px,env(safe-area-inset-bottom))+72px)] z-40 max-h-[calc(100dvh-170px)] overflow-y-auto overscroll-contain rounded-[22px] border border-line bg-surface p-3 shadow-[var(--card-shadow-lift)]"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: SHEET_EASE } }}
              exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.2, ease: SHEET_EASE } }}
              style={{ transformOrigin: "bottom right" }}
            >
              <div className="flex items-center justify-between px-2 pb-2">
                <p className="text-xs font-medium text-ink-3">More</p>
                <button
                  type="button"
                  onClick={close}
                  data-sound="close"
                  aria-label="Close"
                  autoFocus
                  className="grid size-8 place-items-center rounded-full text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <X size={17} />
                </button>
              </div>

              <ul className="grid grid-cols-2 gap-2">
                {more.map((item) => {
                  const Icon = ICONS[item.id];
                  const on = active === item.id;
                  const count = COUNTS[item.id];
                  return (
                    <li key={item.id}>
                      <NavLink
                        item={item}
                        onNavigate={close}
                        aria-current={on ? "page" : undefined}
                        className={`flex h-[72px] flex-col justify-between rounded-[14px] border p-3 text-sm transition-colors ${
                          on ? "border-accent/40 bg-accent-soft text-ink" : "border-line bg-surface-2 text-ink-2 active:bg-surface"
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          <Icon size={18} strokeWidth={1.75} aria-hidden="true" className={on ? "text-accent" : "text-ink-3"} />
                          {count !== undefined && <span className="font-mono text-[11px] text-ink-3 tabular-nums">{count}</span>}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-3 border-t border-line px-1 pt-3">
                <NavActions onNavigate={close} />
                <SocialLinks className="-mx-1 mt-2 justify-between" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
