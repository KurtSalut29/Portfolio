"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react/dist/ssr";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="group flex w-full items-center justify-between gap-4 rounded-[var(--radius-control)] border border-line bg-surface-2 px-4 py-3.5 text-left transition-[border-color,transform] duration-200 hover:border-line-strong active:scale-[0.99]"
    >
      <span className="min-w-0">
        <span className="block text-xs text-ink-3">Email me directly</span>
        <span className="block truncate font-medium text-ink">{email}</span>
      </span>
      <span className="relative grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface text-ink-2">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "check" : "copy"}
            initial={{ opacity: 0, scale: 0.6, filter: "blur(3px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(3px)" }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className={copied ? "text-accent" : ""}
          >
            {copied ? <CheckIcon size={18} weight="bold" /> : <CopyIcon size={18} />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </button>
  );
}
