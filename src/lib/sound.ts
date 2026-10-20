/**
 * Interface sounds, synthesized with the Web Audio API: no audio files to download.
 * Every sound is short, quiet, and soft-edged (filtered noise for clicks, pure sine tones for
 * confirmations), so it reads as feedback, not as an effect. Off until the visitor turns it on.
 */

type Tone = { kind: "tone"; freq: number; glideTo?: number; at?: number; attack: number; decay: number; peak: number };
type Noise = { kind: "noise"; band: number; q: number; at?: number; attack: number; decay: number; peak: number };
type Layer = Tone | Noise;

const SOUNDS = {
  // Pointer moves onto something clickable: the faintest tick.
  hover: [{ kind: "noise", band: 4200, q: 2, attack: 0.001, decay: 0.016, peak: 0.12 }],
  // Press and release: a soft, low click going down, a brighter one coming up, like a real button.
  press: [
    { kind: "noise", band: 1500, q: 1.2, attack: 0.001, decay: 0.022, peak: 0.085 },
    { kind: "tone", freq: 2400, at: 0.004, attack: 0.001, decay: 0.03, peak: 0.008 },
  ],
  release: [
    { kind: "noise", band: 4400, q: 1.8, attack: 0.001, decay: 0.016, peak: 0.075 },
    { kind: "tone", freq: 3000, at: 0.006, attack: 0.001, decay: 0.045, peak: 0.012 },
  ],
  // Switches (theme, sounds, sidebar): two quick ticks, like a physical switch.
  toggle: [
    { kind: "noise", band: 2000, q: 1.6, attack: 0.001, decay: 0.016, peak: 0.09 },
    { kind: "noise", band: 3400, q: 1.6, at: 0.026, attack: 0.001, decay: 0.02, peak: 0.07 },
  ],
  // Something opens (chat, menu, lightbox): a rising pair.
  open: [
    { kind: "tone", freq: 660, attack: 0.01, decay: 0.16, peak: 0.063 },
    { kind: "tone", freq: 990, at: 0.05, attack: 0.01, decay: 0.2, peak: 0.052 },
  ],
  // Something closes: one falling note.
  close: [{ kind: "tone", freq: 880, glideTo: 520, attack: 0.006, decay: 0.14, peak: 0.063 }],
  // A message was sent or a reply arrived: a single soft blip.
  send: [{ kind: "tone", freq: 740, glideTo: 1040, attack: 0.004, decay: 0.09, peak: 0.063 }],
  // Done (comment posted, sounds turned on): a short major arpeggio.
  success: [
    { kind: "tone", freq: 784, attack: 0.004, decay: 0.12, peak: 0.057 },
    { kind: "tone", freq: 988, at: 0.06, attack: 0.004, decay: 0.12, peak: 0.057 },
    { kind: "tone", freq: 1175, at: 0.12, attack: 0.004, decay: 0.2, peak: 0.057 },
  ],
  // A heart: a small upward pop.
  heart: [{ kind: "tone", freq: 600, glideTo: 1100, attack: 0.003, decay: 0.08, peak: 0.07 }],
} satisfies Record<string, Layer[]>;

export type SoundName = keyof typeof SOUNDS;
export const isSoundName = (v: unknown): v is SoundName => typeof v === "string" && v in SOUNDS;

const KEY = "kms-sounds";
const EVENT = "kms-sounds-change";
// Levels matched to bryllim.com's interface sounds (measured by rendering both offline): clearly audible, never loud.
const MASTER = 3.6;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function context() {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
    // Lets the speaker button show when the browser has unlocked audio.
    ctx.onstatechange = () => window.dispatchEvent(new Event(EVENT));
    // One second of white noise, reused by every click from a random offset.
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  } catch {
    ctx = null;
  }
  return ctx;
}

function envelope(ac: AudioContext, l: Layer, t: number, out: AudioNode) {
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(l.peak, t + l.attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + l.attack + l.decay);
  g.connect(out);
  return g;
}

function render(ac: AudioContext, layers: readonly Layer[]) {
  const out = ac.createGain();
  out.gain.value = MASTER;
  out.connect(ac.destination);
  let end = 0;
  for (const l of layers) {
    const t = ac.currentTime + (l.at ?? 0);
    const stop = t + l.attack + l.decay + 0.03;
    end = Math.max(end, stop);
    const g = envelope(ac, l, t, out);
    if (l.kind === "tone") {
      const o = ac.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(l.freq, t);
      if (l.glideTo) o.frequency.exponentialRampToValueAtTime(l.glideTo, t + l.attack + l.decay);
      o.connect(g);
      o.start(t);
      o.stop(stop);
    } else if (noise) {
      const src = ac.createBufferSource();
      src.buffer = noise;
      const f = ac.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = l.band;
      f.Q.value = l.q;
      src.connect(f).connect(g);
      src.start(t, Math.random() * 0.8);
      src.stop(stop);
    }
  }
  setTimeout(() => out.disconnect(), (end - ac.currentTime + 0.1) * 1000);
}

/**
 * Browsers keep audio locked until the visitor first clicks or presses a key on the page, so after a
 * refresh hover ticks stay silent until then. This runs on that first interaction, wherever it lands,
 * so sounds work from there on without touching the toggle.
 */
let unlockedAt = -Infinity;
/** True right after a click unlocked audio, so the speaker button can tell "wake up" from "turn off". */
export const justUnlocked = () => performance.now() - unlockedAt < 1500;

/** Whether this moment counts as a click or key press to the browser (only then may audio start). */
const activeGesture = () => navigator.userActivation?.isActive ?? true;

/** Called on clicks and key presses until audio runs (see UiSounds). */
export function unlockAudio() {
  if (!soundsOn() || audioReady()) return;
  // A key the browser doesn't count (Alt, Ctrl, Esc) can't start audio; wait for a real press.
  if (!activeGesture()) return;
  unlockedAt = performance.now();
  const ac = context();
  if (ac && ac.state !== "running") ac.resume().catch(() => {});
}

/** True once the browser lets this page play sound. */
export const audioReady = () => !!ctx && ctx.state === "running";

export function soundsOn() {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function setSounds(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  if (on) play("success", true);
}

export function subscribeSounds(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Play a sound if sounds are on. Until the browser unlocks audio (first click), sounds are skipped, not queued. */
export function play(name: SoundName, force = false) {
  if (!force && !soundsOn()) return;
  if (audioReady()) return render(ctx!, SOUNDS[name]);
  // Locked: only a sound triggered by a click or key press may start audio. Anything else (a hover)
  // is dropped; queueing it would make every missed tick play at once after the first click.
  if (!activeGesture()) return;
  const ac = context();
  if (!ac) return;
  ac.resume().then(() => ac.state === "running" && render(ac, SOUNDS[name]), () => {});
}
