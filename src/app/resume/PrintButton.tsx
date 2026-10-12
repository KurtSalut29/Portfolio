"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, DownloadSimpleIcon, LinkSimpleIcon } from "@phosphor-icons/react/dist/ssr";

/** Resume actions: copy a shareable link, or print / save as PDF. */
export function ResumeActions() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
          } catch {
            /* clipboard blocked: nothing to do */
          }
        }}
        className="btn btn-secondary h-10 px-3.5 text-sm"
      >
        <span className="relative grid size-4 place-items-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={copied ? "y" : "n"}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            >
              {copied ? <CheckIcon size={16} weight="bold" /> : <LinkSimpleIcon size={16} />}
            </motion.span>
          </AnimatePresence>
        </span>
        <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
      </button>
      <button type="button" onClick={() => window.print()} className="btn btn-primary h-10 px-4 text-sm">
        <DownloadSimpleIcon size={16} aria-hidden="true" />
        Save as PDF
      </button>
    </div>
  );
}
