"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowSquareOutIcon, CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import type { Certificate } from "@/content/certificates";

const EASE = [0.23, 1, 0.32, 1] as const;

/** Every page of every certificate, in order, so the arrows step through them all. */
export type Slide = { cert: Certificate; page: number };

const noop = () => () => {};

const navBtn =
  "grid size-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition-[transform,color,background-color] duration-150 hover:bg-white/[0.12] hover:text-white active:scale-95";

/**
 * Full-screen certificate viewer. Portaled to <body> so transformed ancestors
 * (scroll reveals) can't trap the fixed overlay. Esc closes, arrows step, swipe on touch.
 */
export function CertificateViewer({
  slides,
  index,
  dir,
  onStep,
  onClose,
}: {
  slides: Slide[];
  index: number | null;
  dir: number;
  onStep: (delta: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  // The portal target only exists in the browser; false during SSR and hydration.
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  // Lock scroll, wire keys, keep focus inside, and hand focus back on close.
  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "ArrowLeft") onStep(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      returnTo?.focus({ preventScroll: true });
    };
  }, [open, lenis, onClose, onStep]);

  if (!mounted) return null;

  const slide = index !== null ? slides[index] : null;
  const position = (index ?? 0) + 1;
  const img = slide ? slide.cert.images[slide.page] : null;
  const pages = slide?.cert.images.length ?? 0;

  return createPortal(
    <AnimatePresence>
      {slide && img && (
        <motion.div
          key="viewer"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate: ${slide.cert.title}`}
          className="fixed inset-0 z-[70] flex flex-col bg-[#05080f]/90 text-white backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE } }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-5">
            <p className="font-mono text-xs text-white/60" aria-live="polite">
              {String(position).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={img.src}
                target="_blank"
                rel="noreferrer"
                className="hidden h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm text-white/80 transition-colors hover:bg-white/[0.12] hover:text-white sm:inline-flex"
              >
                <ArrowSquareOutIcon size={16} aria-hidden="true" />
                Open original
              </a>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close viewer" className={navBtn}>
                <XIcon size={18} />
              </button>
            </div>
          </div>

          {/* Stage: click the backdrop around the certificate to close */}
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center gap-4 px-4 py-4 sm:px-6"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <button type="button" onClick={() => onStep(-1)} aria-label="Previous certificate" className={`${navBtn} hidden sm:grid`}>
              <CaretLeftIcon size={18} />
            </button>

            <div className="relative flex h-full min-w-0 flex-1 items-center justify-center" onClick={(e) => e.target === e.currentTarget && onClose()}>
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={`${slide.cert.id}-${slide.page}`}
                  className="flex h-full w-full items-center justify-center"
                  onClick={(e) => e.target === e.currentTarget && onClose()}
                  initial={{ opacity: 0, x: dir * 40, scale: dir === 0 ? 0.96 : 1 }}
                  animate={{ opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, ease: EASE } }}
                  exit={{ opacity: 0, x: dir * -30, transition: { duration: 0.2, ease: EASE } }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60 || info.velocity.x < -400) onStep(1);
                    else if (info.offset.x > 60 || info.velocity.x > 400) onStep(-1);
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(min-width: 1024px) 1100px, 100vw"
                    draggable={false}
                    className="h-auto max-h-full w-auto max-w-full rounded-[10px] bg-white object-contain shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] select-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <button type="button" onClick={() => onStep(1)} aria-label="Next certificate" className={`${navBtn} hidden sm:grid`}>
              <CaretRightIcon size={18} />
            </button>
          </div>

          {/* Caption */}
          <div className="mx-auto flex w-full max-w-[1100px] items-end justify-between gap-4 px-4 pb-5 sm:px-6 sm:pb-7">
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-[0.12em] text-white/50 uppercase">
                {slide.cert.kind}
                {pages > 1 && ` · Page ${slide.page + 1} of ${pages}`}
              </p>
              <p className="mt-1.5 font-display text-lg leading-snug font-semibold tracking-tight sm:text-xl">{slide.cert.title}</p>
              <p className="mt-1 text-sm text-white/65">
                {slide.cert.issuer} · <time dateTime={slide.cert.iso}>{slide.cert.date}</time>
              </p>
              {slide.cert.credentialId && (
                <p className="mt-1 font-mono text-[11px] break-all text-white/45">ID {slide.cert.credentialId}</p>
              )}
            </div>
            {/* Touch screens: arrows live down here, within thumb reach */}
            <div className="flex gap-2 sm:hidden">
              <button type="button" onClick={() => onStep(-1)} aria-label="Previous certificate" className={navBtn}>
                <CaretLeftIcon size={18} />
              </button>
              <button type="button" onClick={() => onStep(1)} aria-label="Next certificate" className={navBtn}>
                <CaretRightIcon size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
