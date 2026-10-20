"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { audioReady, justUnlocked, setSounds, soundsOn, subscribeSounds } from "@/lib/sound";

/**
 * Speaker button: interface sounds are off until a visitor turns them on, and the choice is remembered.
 * After a refresh the browser keeps audio locked until the first click; a small dot shows that wait.
 */
export function SoundToggle() {
  const on = useSyncExternalStore(subscribeSounds, soundsOn, () => false);
  const ready = useSyncExternalStore(subscribeSounds, audioReady, () => false);
  const waiting = on && !ready;
  return (
    <button
      type="button"
      // While waiting for the browser, a press wakes the sounds instead of turning them off.
      // Turning on plays its own confirmation; turning off stays quiet.
      onClick={() => setSounds(waiting || justUnlocked() || !on)}
      data-sound="none"
      aria-pressed={on}
      aria-label={on ? "Turn interface sounds off" : "Turn interface sounds on"}
      title={waiting ? "Sounds on. They start after your first click on the page." : on ? "Sounds on" : "Sounds off"}
      className="relative grid size-10 shrink-0 place-items-center rounded-[var(--radius-control)] border border-line bg-surface text-ink-2 transition-[transform,color] duration-150 hover:text-ink active:scale-95 aria-pressed:text-accent"
    >
      {on ? <Volume2 size={17} strokeWidth={1.75} aria-hidden="true" /> : <VolumeX size={17} strokeWidth={1.75} aria-hidden="true" />}
      {waiting && (
        <span aria-hidden="true" className="absolute top-1.5 right-1.5 size-1.5 animate-pulse rounded-full bg-accent" />
      )}
    </button>
  );
}
