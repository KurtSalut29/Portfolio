"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { dissolveTheme, prepareDissolve } from "./themeDissolve";

export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const { setTheme } = useTheme();
  const ref = useRef<HTMLButtonElement>(null);

  // Build the switch animation while the page is idle, so the first press starts at once.
  useEffect(() => {
    const el = ref.current;
    if (!el || !("requestIdleCallback" in window)) return;
    // Only the toggle on screen: the sidebar keeps a hidden copy in its other (inert) layer.
    const id = requestIdleCallback(() => el.offsetParent && !el.closest("[inert]") && prepareDissolve(el), { timeout: 4000 });
    return () => cancelIdleCallback(id);
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      // Rebuild if the button moved (window resized, sidebar collapsed) before it is pressed.
      onPointerEnter={(e) => prepareDissolve(e.currentTarget)}
      onFocus={(e) => prepareDissolve(e.currentTarget)}
      onClick={(e) => {
        // Read the page itself, not React state, so a quick second press still flips the right way.
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        dissolveTheme(next, e.currentTarget, () => setTheme(next));
      }}
      aria-label="Toggle color theme"
      className={
        withLabel
          ? "group flex h-10 w-full items-center gap-3 rounded-[var(--radius-control)] px-3 text-sm text-ink-2 transition-colors duration-200 hover:bg-surface hover:text-ink"
          : "grid size-10 place-items-center rounded-[var(--radius-control)] border border-line bg-surface text-ink-2 transition-[transform,color] duration-150 hover:text-ink active:scale-95"
      }
    >
      {/* Both icons render; CSS picks one, so there is no hydration flash. */}
      <span className="relative grid size-[18px] place-items-center">
        <SunIcon size={18} className="absolute scale-50 rotate-90 opacity-0 transition-[transform,opacity] duration-300 ease-[var(--ease-out)] dark:scale-100 dark:rotate-0 dark:opacity-100" />
        <MoonIcon size={18} className="absolute scale-100 rotate-0 opacity-100 transition-[transform,opacity] duration-300 ease-[var(--ease-out)] dark:scale-50 dark:-rotate-90 dark:opacity-0" />
      </span>
      {withLabel && (
        <span>
          <span className="dark:hidden">Dark mode</span>
          <span className="hidden dark:inline">Light mode</span>
        </span>
      )}
    </button>
  );
}
