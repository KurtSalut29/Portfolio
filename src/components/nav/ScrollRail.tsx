"use client";

import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";

/**
 * The page scrollbar, redrawn as a section rail (desktop, fine pointers only).
 * A slim thumb rides a column of ticks, one per section; it sits on a tick when that section is at the top.
 * Hover shows where you are; a tick jumps to its section; the thumb drags; the track jumps on click.
 * The native scrollbar stays for touch, small screens, and when JavaScript is off.
 */

const INSET = 12; // matches the sidebar's gap from the window edge
const MIN_THUMB = 40;
const SECTION_GAP = 16; // sections land this far below the top, as in SectionLink

type Mark = { id: string; label: string; top: number };
type Geo = { track: number; thumb: number; max: number };

const NAV_LABEL: Record<string, string> = Object.fromEntries(nav.map((n) => [n.id, n.label]));

function labelFor(el: HTMLElement) {
  return NAV_LABEL[el.id] ?? el.querySelector("h2")?.textContent?.trim() ?? el.id;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function ScrollRail() {
  const lenis = useLenis();
  const pathname = usePathname();
  const thumbRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [geo, setGeo] = useState<Geo>({ track: 0, thumb: MIN_THUMB, max: 0 });
  const [active, setActive] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  /** Thumb offset within the track for a given scroll position. */
  const thumbAt = useCallback((y: number, g: Geo) => (g.max > 0 ? (g.track - g.thumb) * clamp(y / g.max, 0, 1) : 0), []);

  const scrollTo = useCallback(
    (y: number, smooth: boolean) => {
      if (lenis) {
        lenis.scrollTo(y, { immediate: !smooth, force: true, duration: 0.9 });
      } else {
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: y, behavior: smooth && !reduce ? "smooth" : "auto" });
      }
    },
    [lenis],
  );

  // On for desktop pointers only; the class on <html> hides the native bar.
  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px) and (pointer: fine)");
    const sync = () => {
      setEnabled(mq.matches);
      document.documentElement.classList.toggle("has-rail", mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      document.documentElement.classList.remove("has-rail");
    };
  }, []);

  // Measure the page and its sections; again whenever its height changes (images, reveals, route changes).
  useEffect(() => {
    if (!enabled) return;
    const measure = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const track = innerHeight - INSET * 2;
      const thumb = max > 0 ? Math.max(MIN_THUMB, (track * innerHeight) / (max + innerHeight)) : track;
      setGeo({ track, thumb, max });
      setMarks(
        Array.from(document.querySelectorAll<HTMLElement>("main section[id]")).map((el) => ({
          id: el.id,
          label: labelFor(el),
          top: Math.max(0, el.getBoundingClientRect().top + scrollY - SECTION_GAP),
        })),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
    };
  }, [enabled, pathname]);

  // Follow the scroll: move the thumb directly (no re-render per frame), and track the current section.
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let idle = 0;
    const update = () => {
      frame = 0;
      const y = scrollY;
      if (thumbRef.current) thumbRef.current.style.transform = `translateY(${thumbAt(y, geo)}px)`;
      let current: string | null = null;
      for (const mark of marks) if (mark.top <= y + innerHeight * 0.35) current = mark.id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
      // Brighten while the page moves, settle back shortly after.
      railRef.current?.setAttribute("data-scrolling", "");
      clearTimeout(idle);
      idle = window.setTimeout(() => railRef.current?.removeAttribute("data-scrolling"), 900);
    };
    frame = requestAnimationFrame(update);
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(idle);
    };
  }, [enabled, marks, geo, thumbAt]);

  if (!enabled || geo.max <= 0) return null;

  const activeLabel = marks.find((m) => m.id === active)?.label ?? marks[0]?.label;

  const onThumbDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const startY = e.clientY;
    const startScroll = scrollY;
    const ratio = geo.max / Math.max(1, geo.track - geo.thumb);
    setDragging(true);
    const move = (ev: PointerEvent) => scrollTo(startScroll + (ev.clientY - startY) * ratio, false);
    const up = () => {
      setDragging(false);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };

  // A click on the bare track centers the thumb there.
  const onTrackDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const p = (e.clientY - rect.top - geo.thumb / 2) / Math.max(1, geo.track - geo.thumb);
    scrollTo(clamp(p, 0, 1) * geo.max, true);
  };

  const jump = (mark: Mark) => {
    scrollTo(mark.top, true);
    history.replaceState(null, "", mark.id === "home" ? location.pathname : `#${mark.id}`);
  };

  return (
    <div
      ref={railRef}
      aria-hidden="true"
      data-dragging={dragging || undefined}
      className="scroll-rail no-print group/rail fixed right-0 z-[45] w-6"
      style={{ top: INSET, height: geo.track }}
    >
      {/* Track: the hit area for jump-clicks */}
      <div className="absolute inset-0" onPointerDown={onTrackDown} />

      {/* Section ticks */}
      {marks.map((mark) => {
        const y = thumbAt(mark.top, geo) + geo.thumb / 2;
        const on = mark.id === active;
        return (
          <div
            key={mark.id}
            className="rail-tick group/tick absolute right-0 flex h-3 w-6 -translate-y-1/2 items-center justify-center"
            style={{ top: y }}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (e.button === 0) jump(mark);
            }}
          >
            <span className={`rail-tick-mark ${on ? "is-on" : ""}`} />
            <span className="rail-chip rail-tick-label">{mark.label}</span>
          </div>
        );
      })}

      {/* Thumb */}
      <div
        ref={thumbRef}
        className="rail-thumb absolute top-0 right-0 z-[1] flex w-6 justify-center"
        style={{ height: geo.thumb }}
        onPointerDown={onThumbDown}
      >
        <span className="rail-thumb-bar" />
        {activeLabel && <span className="rail-chip rail-thumb-label">{activeLabel}</span>}
      </div>
    </div>
  );
}
