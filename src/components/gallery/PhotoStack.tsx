"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import type { Photo } from "@/content/gallery";
import { Lightbox } from "./Lightbox";

/** Signed distance of card i from the front card, the short way around the loop. */
function offset(i: number, current: number, n: number) {
  let k = (i - current) % n;
  if (k < 0) k += n;
  if (k > n / 2) k -= n;
  return k;
}

/**
 * The photos as a fanned stack: one in front, the rest tilting away on either side.
 * Click the front photo for the next one, a side photo to bring it forward;
 * arrow keys, swipes, and the dots work too. "View full size" opens the viewer.
 */
export function PhotoStack({ photos }: { photos: Photo[] }) {
  const n = photos.length;
  // Cards shown on each side; with few photos, keep a hidden one between the ends so none sweeps across.
  const reach = Math.max(0, Math.min(3, Math.floor((n - 1) / 2) - 1));
  const [current, setCurrent] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const drag = useRef<{ x: number; swiped: boolean }>({ x: 0, swiped: false });

  const go = useCallback((i: number) => setCurrent(((i % n) + n) % n), [n]);
  const step = useCallback(
    (delta: number) => {
      setCurrent((c) => (c + delta + n) % n);
      setViewer((v) => (v === null ? v : (v + delta + n) % n));
    },
    [n],
  );
  const closeViewer = useCallback(() => setViewer(null), []);

  const photo = photos[current];

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Photos"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
        }}
        // A horizontal swipe steps through the photos instead of clicking a card.
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, swiped: false };
        }}
        onPointerUp={(e) => {
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 40) {
            drag.current.swiped = true;
            step(dx < 0 ? 1 : -1);
          }
        }}
        onClickCapture={(e) => {
          if (drag.current.swiped) {
            e.stopPropagation();
            drag.current.swiped = false;
          }
        }}
        className="photo-stack relative mx-auto h-[calc(var(--card-w)*4/3+40px)] touch-pan-y rounded-[var(--radius-card)] select-none [--card-w:220px] [--stack-step:26px] sm:[--card-w:290px] sm:[--stack-step:62px]"
      >
        {photos.map((p, i) => {
          const k = offset(i, current, n);
          const shown = Math.abs(k) <= reach;
          // Hidden cards wait just past the ends, so they fade in from the edge of the fan.
          const kc = Math.max(-(reach + 1), Math.min(reach + 1, k));
          const a = Math.abs(kc);
          const front = k === 0;
          return (
            <button
              key={p.src}
              type="button"
              tabIndex={shown ? 0 : -1}
              aria-hidden={!shown || undefined}
              aria-label={front ? `Next photo (showing ${i + 1} of ${n})` : `Show photo ${i + 1} of ${n}`}
              onClick={() => (front ? step(1) : go(i))}
              className={`photo-card absolute top-3 left-1/2 aspect-[3/4] w-[var(--card-w)] overflow-hidden rounded-[22px] border-[3px] border-surface bg-surface-2 ${
                front ? "shadow-[var(--card-shadow-lift)]" : "shadow-[var(--card-shadow)]"
              } ${shown ? "" : "pointer-events-none"}`}
              style={{
                zIndex: 20 - Math.abs(k),
                opacity: shown ? 1 : 0,
                transform: `translateX(-50%) translateX(calc(${kc} * var(--stack-step))) translateY(${a * 6}px) rotate(${kc * 5}deg) scale(${1 - a * 0.075})`,
              }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 640px) 290px, 220px"
                quality={90}
                loading={Math.abs(k) <= reach + 1 ? "eager" : "lazy"}
                className="object-cover"
                draggable={false}
              />
            </button>
          );
        })}
      </div>

      {/* Where you are */}
      <div className="mt-6 flex justify-center gap-0.5" role="group" aria-label="Choose a photo">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Photo ${i + 1}`}
            aria-current={i === current || undefined}
            className="grid h-5 w-3.5 place-items-center"
          >
            <span
              className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out)] ${
                i === current ? "w-4 bg-ink" : "w-1.5 bg-line-strong hover:bg-ink-3"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mt-4 text-center" aria-live="polite">
        <p className="text-[13px] text-ink-3">
          {photo.category} · {current + 1} / {n}
        </p>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-[13px] text-ink-3">
        <span className="hidden sm:inline">Click the stack to shuffle</span>
        <span className="sm:hidden">Tap or swipe the stack</span>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => setViewer(current)}
          className="inline-flex items-center gap-1.5 font-medium text-ink-2 transition-colors hover:text-ink"
        >
          <Maximize2 size={13} strokeWidth={2} aria-hidden="true" />
          View full size
        </button>
      </div>

      <Lightbox photos={photos} index={viewer} onStep={step} onClose={closeViewer} />
    </div>
  );
}
