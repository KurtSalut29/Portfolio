"use client";

import { useSyncExternalStore } from "react";
import { Sparkles } from "lucide-react";
import { openAsk } from "./ask";

const noop = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * The sidebar's way into the "Ask" overlay: a row with the shortcut when the sidebar is open,
 * an icon in the rail. The shortcut reads ⌥K on a Mac and Alt K elsewhere.
 */
export function AskButton({ compact = false }: { compact?: boolean }) {
  const mac = useSyncExternalStore(noop, isMac, () => false);
  const keys = mac ? ["⌥", "K"] : ["Alt", "K"];

  if (compact) {
    return (
      <button
        type="button"
        onClick={openAsk}
        data-sound="open"
        aria-label="Ask about Kurt (AI)"
        aria-keyshortcuts="Alt+K"
        className="grid size-10 place-items-center rounded-[var(--radius-control)] border border-line bg-surface-2 text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
      >
        <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={openAsk}
      data-sound="open"
      aria-keyshortcuts="Alt+K"
      className="group flex h-10 w-full items-center gap-2.5 rounded-[var(--radius-control)] border border-line bg-surface-2 px-3 text-sm text-ink-2 transition-[color,border-color] duration-200 hover:border-line-strong hover:text-ink"
    >
      <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" className="text-accent" />
      <span className="flex-1 text-left">Ask about Kurt</span>
      <span className="flex gap-1" aria-hidden="true">
        {keys.map((k) => (
          <kbd
            key={k}
            className="grid h-5 min-w-5 place-items-center rounded-[5px] border border-line bg-surface px-1 font-mono text-[10.5px] text-ink-3"
          >
            {k}
          </kbd>
        ))}
      </span>
    </button>
  );
}
