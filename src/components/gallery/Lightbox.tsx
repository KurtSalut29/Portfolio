"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/content/gallery";

const EASE = [0.23, 1, 0.32, 1] as const;
const noop = () => () => {};

const navBtn =
  "grid size-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition-[transform,color,background-color] duration-150 hover:bg-white/[0.12] hover:text-white active:scale-95";

/**
 * Full-screen photo viewer, portaled to <body> so transformed ancestors can't trap it.
 * Esc closes, arrow keys step, focus returns to where it was.
 */
export function Lightbox({
  photos,
  index,
  onStep,
  onClose,
}: {
  photos: Photo[];
  index: number | null;
  onStep: (delta: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const mounted = useSyncExternalStore(noop, () => true, () => false);

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
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lenis?.start();
      returnTo?.focus();
    };
  }, [open, lenis, onClose, onStep]);

  if (!mounted) return null;
  const photo = index !== null ? photos[index] : null;

  return createPortal(
    <AnimatePresence>
      {photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex flex-col bg-[#05080f]/95 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 pt-4 text-white/70 sm:px-6">
            <p className="font-mono text-xs tabular-nums">
              {index! + 1} / {photos.length}
            </p>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={navBtn}>
              <X size={18} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center gap-3 px-3 py-4 sm:px-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
            {photos.length > 1 && (
              <button type="button" onClick={() => onStep(-1)} aria-label="Previous photo" className={`${navBtn} hidden sm:grid`}>
                <ChevronLeft size={20} />
              </button>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="relative h-full min-w-0 flex-1"
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="100vw" quality={90} className="object-contain" />
              </motion.div>
            </AnimatePresence>
            {photos.length > 1 && (
              <button type="button" onClick={() => onStep(1)} aria-label="Next photo" className={`${navBtn} hidden sm:grid`}>
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 px-4 pb-5 sm:px-6">
            <p className="text-[13px] text-white/60">{photo.category}</p>
            {photos.length > 1 && (
              <div className="flex gap-2 sm:hidden">
                <button type="button" onClick={() => onStep(-1)} aria-label="Previous photo" className={navBtn}>
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={() => onStep(1)} aria-label="Next photo" className={navBtn}>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
