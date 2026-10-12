import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";

const WIDTHS = {
  /** The reading column every page is built on, centered in the space beside the sidebar. */
  column: "max-w-[calc(680px+2rem)] sm:max-w-[calc(680px+3rem)]",
  /** Printable documents (the resume). */
  document: "max-w-[calc(1000px+2rem)] sm:max-w-[calc(1000px+3rem)]",
} as const;

export function Container({
  children,
  className = "",
  width = "column",
}: {
  children: ReactNode;
  className?: string;
  width?: keyof typeof WIDTHS;
}) {
  return <div className={`mx-auto w-full px-4 sm:px-6 ${WIDTHS[width]} ${className}`}>{children}</div>;
}

/**
 * Section header: headline with an optional lead stacked below it.
 * String titles rise in word by word. Eyebrows are rationed on purpose.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-[720px] ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className="label-mono mb-4 uppercase tracking-[0.14em]">{eyebrow}</p>
        </Reveal>
      )}
      <h2
        id={id}
        className="text-[2.25rem] leading-[1.04] font-semibold tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.5rem]"
      >
        {typeof title === "string" ? <WordReveal text={title} /> : title}
      </h2>
      {lead && (
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-2 sm:text-lg">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
