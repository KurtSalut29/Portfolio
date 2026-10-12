"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import {
  ChalkboardTeacherIcon,
  GraduationCapIcon,
  MagnifyingGlassPlusIcon,
  SealCheckIcon,
  TrophyIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react/dist/ssr";
import { certificates, type CertificateKind } from "@/content/certificates";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { CertificateViewer, type Slide } from "./CertificateViewer";

const KIND_ICON: Record<CertificateKind, typeof TrophyIcon> = {
  Award: TrophyIcon,
  Course: GraduationCapIcon,
  "Micro-credential": SealCheckIcon,
  Seminar: ChalkboardTeacherIcon,
  Webinar: VideoCameraIcon,
};

const slides: Slide[] = certificates.flatMap((cert) => cert.images.map((_, page) => ({ cert, page })));
const firstSlide = (id: string) => slides.findIndex((s) => s.cert.id === id);

export function CertificateGrid() {
  const [[index, dir], setState] = useState<[number | null, number]>([null, 0]);

  const step = useCallback(
    (delta: number) =>
      setState(([i]) => (i === null ? [null, 0] : [(i + delta + slides.length) % slides.length, delta])),
    [],
  );
  const close = useCallback(() => setState([null, 0]), []);

  // One run of cards. The track holds two runs and slides by exactly one, so the loop is seamless.
  const row = (dup: boolean) => (
    <ul
      className={`flex shrink-0 items-stretch gap-5 pr-5 ${dup ? "marquee-dup" : ""}`}
      aria-hidden={dup || undefined}
      // The copy is for the eye only: keep it out of the tab order and away from screen readers.
      inert={dup}
    >
      {certificates.map((c) => {
        const KindIcon = KIND_ICON[c.kind];
        const cover = c.images[0];
        const award = c.kind === "Award";
        return (
          <li key={c.id} className="flex w-[280px] shrink-0">
          <Spotlight className="card group flex h-full w-full flex-col overflow-hidden">
            {/* The certificate sits on a mat, like a framed document */}
            <button
              type="button"
              onClick={() => setState([firstSlide(c.id), 0])}
              aria-label={`View certificate: ${c.title}`}
              className="relative grid aspect-[4/3] place-items-center overflow-hidden border-b border-line bg-surface-2 p-6"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-60 [background:radial-gradient(120%_80%_at_50%_0%,var(--accent-soft),transparent_70%)]"
              />
              <Image
                src={cover.src}
                alt=""
                width={cover.width}
                height={cover.height}
                sizes="280px"
                className="relative h-auto max-h-full w-auto max-w-full rounded-[6px] bg-white object-contain shadow-[0_1px_2px_hsl(var(--shadow-tint)/0.15),0_14px_30px_-12px_hsl(var(--shadow-tint)/0.45)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:rotate-[-0.6deg]"
              />
              {c.images.length > 1 && (
                <span className="absolute top-3 left-3 rounded-full border border-line bg-surface/90 px-2.5 py-1 font-mono text-[10.5px] text-ink-2 backdrop-blur">
                  {c.images.length} pages
                </span>
              )}
              <span
                aria-hidden="true"
                className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-bg opacity-0 shadow-[var(--card-shadow-lift)] transition-[opacity,transform] duration-200 ease-[var(--ease-out)] translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100"
              >
                <MagnifyingGlassPlusIcon size={14} weight="bold" />
                View
              </span>
            </button>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <span className={`chip ${award ? "border-transparent bg-accent text-accent-ink" : ""}`}>
                  <KindIcon size={14} weight={award ? "fill" : "regular"} aria-hidden="true" />
                  {c.kind}
                </span>
                <time dateTime={c.iso} className="font-mono text-[11px] text-ink-3">
                  {c.date}
                </time>
              </div>
              <h3 className="mt-4 text-base leading-snug font-semibold tracking-tight text-ink">{c.title}</h3>
              <p className="mt-1 text-sm text-ink-3">{c.issuer}</p>
              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-ink-2">{c.summary}</p>
            </div>
          </Spotlight>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Same motion as the tools band: a slow, constant drift that pauses on hover or focus */}
      <Reveal className="marquee mt-12 -mx-4 overflow-hidden px-4 py-2 sm:-mx-6 sm:px-6" role="region" aria-label="Certificates">
        <div className="marquee-track flex w-max" style={{ "--marquee-duration": "60s" } as React.CSSProperties}>
          {row(false)}
          {row(true)}
        </div>
      </Reveal>

      <p className="mt-6 flex items-center gap-2 text-[13px] text-ink-3">
        <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
        Up next: {profile.now.learning.toLowerCase()}.
      </p>

      <CertificateViewer slides={slides} index={index} dir={dir} onStep={step} onClose={close} />
    </>
  );
}
