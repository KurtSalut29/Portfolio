"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { Expand, Monitor, Smartphone, X } from "lucide-react";
import type { Project, Shot } from "@/content/projects";

type Kind = "web" | "mobile";
const LABEL: Record<Kind, string> = { web: "Web", mobile: "Mobile" };

/** The shot for the current theme: both render, CSS shows the matching one. */
function ThemedShot({ shot, alt }: { shot: Shot; alt: string }) {
  const cls = "object-contain";
  if (typeof shot === "string") return <Image src={shot} alt={alt} fill unoptimized className={cls} />;
  return (
    <>
      <Image src={shot.light} alt={alt} fill unoptimized className={`${cls} dark:hidden`} />
      <Image src={shot.dark} alt={alt} fill unoptimized className={`${cls} hidden dark:block`} />
    </>
  );
}

/**
 * "View full size" for a project's real screenshots. Opens a native modal dialog,
 * which gives focus trapping, Esc to close, and a backdrop for free.
 */
export function ScreenshotViewer({ project }: { project: Project }) {
  const screens = project.screens;
  const kinds = (["web", "mobile"] as const).filter((k) => screens?.[k]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<Kind>(kinds[0] ?? "web");
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
    };
  }, [open, lenis]);

  if (!screens || kinds.length === 0) return null;
  const shot = screens[kind]!;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setKind(kinds[0]);
          dialog.current?.showModal();
          setOpen(true);
        }}
        className="absolute top-3 right-3 z-10 inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface/85 px-3 text-xs font-medium text-ink-2 shadow-[var(--card-shadow)] backdrop-blur transition-[color,border-color,transform] duration-200 hover:border-line-strong hover:text-ink active:scale-[0.97]"
      >
        <Expand size={13} strokeWidth={2} aria-hidden="true" />
        View full size
      </button>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        aria-label={`${project.name} screenshots`}
        className="m-auto h-[min(92dvh,1000px)] max-h-none w-[min(94vw,1400px)] max-w-none overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-0 text-ink shadow-[var(--card-shadow-lift)] backdrop:bg-[#05080f]/80 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
            <p className="font-medium">
              {project.name} <span className="text-ink-3">— {project.short}</span>
            </p>
            <div className="flex items-center gap-2">
              {kinds.length > 1 && (
                <div className="flex rounded-full border border-line bg-surface-2 p-0.5" role="group" aria-label="Screenshot">
                  {kinds.map((k) => {
                    const I = k === "web" ? Monitor : Smartphone;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setKind(k)}
                        aria-pressed={kind === k}
                        className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
                          kind === k ? "bg-surface text-ink shadow-[var(--card-shadow)]" : "text-ink-3 hover:text-ink"
                        }`}
                      >
                        <I size={13} strokeWidth={2} aria-hidden="true" />
                        {LABEL[k]}
                      </button>
                    );
                  })}
                </div>
              )}
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-full border border-line text-ink-2 hover:text-ink"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
          <div className="relative min-h-0 flex-1 bg-surface-2">
            <div className="absolute inset-3 sm:inset-5">
              {open && <ThemedShot shot={shot} alt={`${project.name} ${kind === "web" ? "web dashboard" : "mobile app"}, full size`} />}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
