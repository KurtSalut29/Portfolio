"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Volume2 } from "lucide-react";
import { audioReady, isSoundName, play, soundsOn, subscribeSounds, unlockAudio } from "@/lib/sound";

// What counts as clickable. Anything inside [data-sound="none"] stays silent.
const CLICKABLE = 'a[href], button:not([disabled]), [role="button"], [role="tab"], summary, input[type="submit"], label[data-sound]';

/**
 * One set of listeners for the whole site: a tick when the mouse moves onto something clickable,
 * a click when it is pressed and another when it is let go. An element can ask for a different sound
 * on click with data-sound (toggle, open, close, send, success, heart), or for silence with data-sound="none".
 */
export function UiSounds() {
  // Shown once if a visitor with sounds on hovers before their first click (when browsers keep audio locked).
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let hovered: Element | null = null;
    let lastHover = 0;
    let hinted = false;

    const target = (e: Event) => {
      const el = e.target instanceof Element ? e.target.closest(CLICKABLE) : null;
      if (!el || el.closest('[data-sound="none"]')) return null;
      return el as HTMLElement;
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches) return;
      const el = target(e);
      if (el === hovered) return;
      hovered = el;
      const now = performance.now();
      // Sweeping across a list shouldn't sound like a rattle.
      if (!el || now - lastHover < 90) return;
      lastHover = now;
      if (soundsOn() && !audioReady() && !hinted) {
        hinted = true;
        setHint(true);
      }
      play("hover");
    };

    // Press on the way down, release on the way up, like a physical button.
    let pressed: Element | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const el = target(e);
      pressed = el;
      // Elements with their own sound play it on click instead.
      if (el && !el.dataset.sound) play("press");
    };
    const onUp = (e: PointerEvent) => {
      const el = target(e);
      if (el && el === pressed && !el.dataset.sound) play("release");
      pressed = null;
    };

    const onClick = (e: MouseEvent) => {
      const el = target(e);
      if (!el) return;
      const own = el.dataset.sound;
      if (isSoundName(own)) play(own);
      // Keyboard presses (Enter/Space) have no pointerdown; give them the press sound here.
      else if (e.detail === 0) play("press");
    };

    // The first click or key press anywhere opens the browser's audio lock. Browsers differ on which
    // event counts (Chrome: pointerdown; Firefox and Safari: the click or pointerup), so listen to all
    // of them, and keep listening until audio actually runs.
    const GESTURES = ["pointerdown", "pointerup", "click", "keydown", "keyup", "touchend"];
    const unlock = () => unlockAudio();
    const stopUnlocking = () => {
      for (const t of GESTURES) window.removeEventListener(t, unlock, true);
    };
    for (const t of GESTURES) window.addEventListener(t, unlock, true);
    const unsubscribe = subscribeSounds(() => {
      if (!audioReady()) return;
      stopUnlocking();
      setHint(false);
    });

    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("click", onClick, true);
    return () => {
      stopUnlocking();
      unsubscribe();
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  // The hint steps aside after a few seconds even without a click.
  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(false), 5000);
    return () => clearTimeout(t);
  }, [hint]);

  return (
    <AnimatePresence>
      {hint && (
        <motion.p
          role="status"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] whitespace-nowrap text-bg shadow-[var(--card-shadow-lift)] lg:left-[calc(50%+var(--sidebar-w)/2)]"
        >
          <Volume2 size={15} strokeWidth={2} aria-hidden="true" />
          Sounds are on. Click anywhere to hear them.
        </motion.p>
      )}
    </AnimatePresence>
  );
}
