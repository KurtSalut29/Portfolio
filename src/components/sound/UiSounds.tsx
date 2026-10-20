"use client";

import { useEffect } from "react";
import { isSoundName, play, unlockAudio } from "@/lib/sound";

// What counts as clickable. Anything inside [data-sound="none"] stays silent.
const CLICKABLE = 'a[href], button:not([disabled]), [role="button"], [role="tab"], summary, input[type="submit"], label[data-sound]';

/**
 * One set of listeners for the whole site: a tick when the mouse moves onto something clickable,
 * a click when it is pressed and another when it is let go. An element can ask for a different sound
 * on click with data-sound (toggle, open, close, send, success, heart), or for silence with data-sound="none".
 */
export function UiSounds() {
  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let hovered: Element | null = null;
    let lastHover = 0;

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

    // The first click or key press anywhere opens the browser's audio lock.
    const unlock = () => {
      unlockAudio();
      for (const t of ["pointerdown", "keydown", "touchend"]) window.removeEventListener(t, unlock, true);
    };
    for (const t of ["pointerdown", "keydown", "touchend"]) window.addEventListener(t, unlock, true);

    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("click", onClick, true);
    return () => {
      for (const t of ["pointerdown", "keydown", "touchend"]) window.removeEventListener(t, unlock, true);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    };
  }, []);
  return null;
}
