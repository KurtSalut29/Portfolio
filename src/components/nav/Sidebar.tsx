"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FileText, PanelLeft } from "lucide-react";
import { profile } from "@/content/profile";
import { Avatar } from "./Avatar";
import { NavList } from "./NavList";
import { NavActions } from "./NavActions";
import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";
import { SIDEBAR_KEY as KEY } from "./sidebarScript";

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-sidebar"] });
  return () => mo.disconnect();
}
const readCollapsed = () => document.documentElement.dataset.sidebar === "collapsed";

function setCollapsed(next: boolean) {
  const root = document.documentElement;
  if (next) root.dataset.sidebar = "collapsed";
  else delete root.dataset.sidebar;
  try {
    localStorage.setItem(KEY, next ? "collapsed" : "open");
  } catch {}
}

/**
 * Fixed desktop sidebar (lg and up): a card floating off the page edge.
 * Collapses to an icon rail: the card narrows, labels fade, and every icon stays exactly where it was.
 * The width lives in --sidebar-w on <html>, so the page beside it glides over in the same motion.
 */
export function Sidebar() {
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);
  const aside = useRef<HTMLElement>(null);
  const [tip, setTip] = useState<{ label: string; top: number } | null>(null);

  // Ctrl/⌘ + \ toggles, like a code editor's side bar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "\\") {
        e.preventDefault();
        setCollapsed(!readCollapsed());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // In the rail, icons name themselves in a tooltip on hover or keyboard focus.
  const showTip = (target: EventTarget | null) => {
    if (!readCollapsed()) return setTip(null);
    const el = (target as HTMLElement | null)?.closest<HTMLElement>("[data-tip]");
    if (!el || !aside.current?.contains(el)) return setTip(null);
    // A display:contents wrapper has no box of its own; measure the control inside it.
    const box = el.getBoundingClientRect().height ? el : (el.firstElementChild as HTMLElement | null) ?? el;
    const r = box.getBoundingClientRect();
    setTip({ label: el.dataset.tip!, top: r.top + r.height / 2 });
  };

  return (
    <>
      <aside
        ref={aside}
        aria-label="Sidebar"
        onPointerOver={(e) => showTip(e.target)}
        onPointerLeave={() => setTip(null)}
        onFocus={(e) => showTip(e.target)}
        onBlur={() => setTip(null)}
        className="sidebar no-print fixed inset-y-3 left-3 z-40 hidden w-[calc(var(--sidebar-w)-12px)] flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--card-shadow)] lg:flex"
      >
        {/* Identity */}
        <div className="sb-identity relative shrink-0 py-5 pr-5 [@media(max-height:760px)]:py-4">
          <Link
            href="/"
            aria-label={`${profile.fullName}, home`}
            tabIndex={collapsed ? -1 : undefined}
            className="flex items-center gap-2.5 rounded-[var(--radius-control)] whitespace-nowrap"
          >
            <Avatar size={36} />
            <span className="sb-fade min-w-0 pr-9">
              <span className="block font-display text-[15.5px] leading-tight font-semibold tracking-[-0.02em] text-ink">
                {profile.fullName}
              </span>
              <span className="mt-0.5 block text-[12.5px] text-ink-3">{profile.role}</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            data-tip={collapsed ? "Expand sidebar" : undefined}
            title={collapsed ? undefined : "Collapse sidebar (Ctrl+\\)"}
            className="sb-toggle absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-[10px] text-ink-3 hover:bg-[var(--nav-hover)] hover:text-ink"
          >
            <PanelLeft size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        {/* Navigation: scrolls on its own when the window is too short for every link
            (smooth scrolling hands it the wheel then; see Providers). */}
        <div className="sidebar-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain border-t border-line px-3 py-5 [@media(max-height:760px)]:py-4">
          <NavList layoutGroup="sidebar" />
        </div>

        {/* Base: the full actions when open, two icon buttons in the rail; they cross-fade in place */}
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)] border-t border-line p-4 [@media(max-height:760px)]:p-3">
          <div className="sb-fade col-start-1 row-start-1 w-[238px]" inert={collapsed}>
            <NavActions />
            <SocialLinks className="-mx-1 mt-3 justify-between" />
          </div>
          <div className="sb-rail col-start-1 row-start-1 flex flex-col items-center gap-2" inert={!collapsed}>
            <Link
              href={profile.resumeHref}
              transitionTypes={["nav-forward"]}
              aria-label="Resume"
              data-tip="Resume"
              className="grid size-10 place-items-center rounded-[var(--radius-control)] border border-line bg-surface-2 text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
            </Link>
            <span data-tip="Switch theme" className="contents">
              <ThemeToggle />
            </span>
          </div>
        </div>
      </aside>

      {/* Rail tooltip, outside the card so its overflow can't clip it */}
      <div
        aria-hidden="true"
        className={`sb-tip pointer-events-none fixed z-50 hidden -translate-y-1/2 rounded-[8px] bg-ink px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-bg shadow-[var(--card-shadow-lift)] lg:block ${
          tip && collapsed ? "is-on" : ""
        }`}
        style={{ top: tip?.top ?? 0 }}
      >
        {tip?.label}
      </div>
    </>
  );
}
