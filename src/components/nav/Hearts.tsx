"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const SENT_KEY = "kms-hearted";
const FLUSH_MS = 700;

const format = (n: number) => n.toLocaleString("en-US");

const noop = () => () => {};
const readSent = () => {
  try {
    return localStorage.getItem(SENT_KEY) !== null;
  } catch {
    return false;
  }
};

/**
 * "Hearts this month": a shared counter with a heart button.
 * Each press pulses the heart and sends a few small hearts floating up; the count updates at once
 * and quick presses are batched into one request.
 */
export function Hearts({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);
  // Hearted before, in this browser (false on the server and during hydration).
  const sentBefore = useSyncExternalStore(noop, readSent, () => false);
  const [sentNow, setSentNow] = useState(false);
  const sent = sentBefore || sentNow;
  const [pulse, setPulse] = useState(0);
  const pending = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/hearts", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => typeof d?.count === "number" && setCount(d.count))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  const flush = useCallback(() => {
    const n = pending.current;
    if (!n) return;
    pending.current = 0;
    fetch("/api/hearts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n }),
      keepalive: true,
    })
      .then((r) => (r.ok ? r.json() : null))
      // Take the server's total unless more presses are already waiting to be sent.
      .then((d) => typeof d?.count === "number" && !pending.current && setCount(d.count))
      .catch(() => {});
  }, []);

  // Don't lose the last few presses when the visitor leaves.
  useEffect(() => {
    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      flush();
    };
  }, [flush]);

  function spawnHearts() {
    const host = button.current;
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 5; i++) {
      const h = document.createElement("span");
      h.className = "heart-float";
      h.setAttribute("aria-hidden", "true");
      h.style.setProperty("--dx", `${Math.round((Math.random() - 0.5) * 56)}px`);
      h.style.setProperty("--rot", `${Math.round((Math.random() - 0.5) * 50)}deg`);
      h.style.setProperty("--s", `${0.55 + Math.random() * 0.5}`);
      h.style.animationDelay = `${i * 45}ms`;
      h.addEventListener("animationend", () => h.remove(), { once: true });
      host.appendChild(h);
    }
  }

  function love() {
    pending.current += 1;
    setCount((c) => (c === null ? c : c + 1));
    setPulse((p) => p + 1);
    spawnHearts();
    if (!sent) {
      setSentNow(true);
      try {
        localStorage.setItem(SENT_KEY, "1");
      } catch {}
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(flush, FLUSH_MS);
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-3.5 gap-y-2 ${className}`}>
      <button
        ref={button}
        type="button"
        onClick={love}
        data-sound="heart"
        aria-pressed={sent}
        aria-label="Send a heart"
        className="heart-btn relative inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface pr-4 pl-3.5 text-sm font-medium text-ink shadow-[var(--card-shadow)] transition-[transform,border-color] duration-150 hover:border-line-strong active:scale-[0.96]"
      >
        <Heart
          key={pulse}
          size={17}
          strokeWidth={2}
          aria-hidden="true"
          className={`${pulse ? "heart-pulse" : ""} ${sent ? "fill-[var(--heart)] text-[var(--heart)]" : "text-ink-2"}`}
        />
        {sent ? "Thanks!" : "Leave a heart"}
      </button>
      <p className="text-sm text-ink-3" aria-live="polite">
        <span className="font-mono text-ink tabular-nums">{count === null ? "—" : format(count)}</span> hearts this month
      </p>
    </div>
  );
}
