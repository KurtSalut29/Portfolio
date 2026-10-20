"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setSounds, soundsOn, subscribeSounds } from "@/lib/sound";

/** Speaker button: interface sounds are off until a visitor turns them on, and the choice is remembered. */
export function SoundToggle() {
  const on = useSyncExternalStore(subscribeSounds, soundsOn, () => false);
  return (
    <button
      type="button"
      onClick={() => setSounds(!on)}
      // Turning on plays its own confirmation; turning off stays quiet.
      data-sound="none"
      aria-pressed={on}
      aria-label={on ? "Turn interface sounds off" : "Turn interface sounds on"}
      title={on ? "Sounds on" : "Sounds off"}
      className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-control)] border border-line bg-surface text-ink-2 transition-[transform,color] duration-150 hover:text-ink active:scale-95 aria-pressed:text-accent"
    >
      {on ? <Volume2 size={17} strokeWidth={1.75} aria-hidden="true" /> : <VolumeX size={17} strokeWidth={1.75} aria-hidden="true" />}
    </button>
  );
}
