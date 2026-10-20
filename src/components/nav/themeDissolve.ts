/**
 * Theme switch as a pixel dissolve: the new theme spreads out from the toggle that was pressed,
 * square by square, in an ordered (Bayer) dither pattern.
 * Built on the View Transitions API: the browser snapshots the old page, we swap the theme,
 * then step a mask over the new snapshot. Falls back to an instant swap.
 *
 * Every frame of the mask lives in one tall image (a sprite), and the animation only moves which slice
 * shows. Swapping a separate image per frame made the browser decode each one mid-animation, and any frame
 * that wasn't ready yet showed the old theme for an instant: a flicker, worst right after a refresh.
 */

const STEPS = 22; // mask frames across the animation
const DURATION = 620;
const MAX_SPRITE = 16000; // stay under the GPU's largest texture

// 4×4 Bayer matrix: spreads each step's new squares evenly instead of in clumps.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Size of one dither square: 4 CSS pixels, larger only on very tall screens so the sprite still fits. */
const squareSize = () => Math.max(4, Math.ceil((innerHeight * (STEPS + 1)) / MAX_SPRITE));

/** Draws the sprite: frame k (top to bottom) shows every square whose threshold is below the k-th cut. */
function sprite(originX: number, originY: number) {
  const px = squareSize();
  const w = Math.ceil(innerWidth / px);
  const h = Math.ceil(innerHeight / px);
  const ox = originX / px;
  const oy = originY / px;
  // Distance to the farthest corner, so the wave always finishes off-screen.
  const far = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy));

  // Each square's threshold: mostly distance from the toggle, partly its place in the dither.
  const threshold = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = Math.hypot(x - ox, y - oy) / far;
      threshold[y * w + x] = d * 0.72 + ((BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16) * 0.28;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h * (STEPS + 1);
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let k = 0; k <= STEPS; k++) {
    const cut = easeOut(k / STEPS) * 1.01;
    for (let i = 0; i < threshold.length; i++) img.data[i * 4 + 3] = threshold[i] < cut ? 255 : 0;
    ctx.putImageData(img, 0, k * h);
  }
  return { canvas, frame: h * px, size: `${w * px}px ${h * px * (STEPS + 1)}px` };
}

/** One keyframe per slice; each holds until the next (step-end), so the mask never slides between slices. */
function keyframes(url: string, size: string, frame: number): Keyframe[] {
  const mask = `url(${url})`;
  return Array.from({ length: STEPS + 1 }, (_, k) => {
    const pos = `0px ${-k * frame}px`;
    return {
      maskImage: mask,
      WebkitMaskImage: mask,
      maskSize: size,
      WebkitMaskSize: size,
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskPosition: pos,
      WebkitMaskPosition: pos,
      easing: "step-end",
    };
  });
}

/** Where a press would start the wave (to the nearest 24px, close enough to look exact), plus the viewport it was built for. */
function keyFor(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  return { x, y, key: `${innerWidth}x${innerHeight}@${Math.round(x / 24)},${Math.round(y / 24)}` };
}

/*
 * The sprite is built ahead of time, off the click: when the toggle is hovered or focused, or when the
 * page is idle. It is encoded without blocking and decoded up front, so a press starts at once.
 */
let ready: { key: string; frames: Keyframe[]; url: string } | null = null;
let building: string | null = null;

export function prepareDissolve(el: HTMLElement) {
  if (typeof document === "undefined" || !document.startViewTransition) return;
  const { x, y, key } = keyFor(el);
  if (ready?.key === key || building === key) return;
  building = key;
  void (async () => {
    const { canvas, frame, size } = sprite(x, y);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res));
    if (!blob || building !== key) return;
    const url = URL.createObjectURL(blob);
    const im = new Image();
    im.src = url;
    await im.decode().catch(() => {});
    if (building !== key) {
      URL.revokeObjectURL(url);
      return;
    }
    const old = ready;
    ready = { key, url, frames: keyframes(url, size, frame) };
    building = null;
    // The old sprite may still be on screen for a moment; free it once that switch is surely over.
    if (old) setTimeout(() => URL.revokeObjectURL(old.url), DURATION * 2);
  })();
}

/** Fallback when nothing was prepared (e.g. a keyboard press right after load): build it now. */
function framesNow(x: number, y: number): Keyframe[] {
  const { canvas, frame, size } = sprite(x, y);
  return keyframes(canvas.toDataURL(), size, frame);
}

let running = false;

function apply(theme: string) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}

/**
 * Switch to `theme`, dissolving outward from `origin` (the pressed button).
 * `commit` saves the choice (next-themes' setTheme), which then re-applies the same attribute.
 * Presses during a switch are ignored: starting a second transition mid-wave would snap the first one
 * to its end and restart from there, which reads as a glitch.
 */
export function dissolveTheme(theme: string, origin: HTMLElement, commit: () => void) {
  if (running) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) {
    apply(theme);
    commit();
    return;
  }

  const { x, y, key } = keyFor(origin);
  const frames = ready?.key === key ? ready.frames : framesNow(x, y);
  const root = document.documentElement;

  // Color transitions would let the new snapshot catch the old colors mid-fade; hold them off for the swap.
  const still = document.createElement("style");
  still.textContent = "*,*::before,*::after{transition:none!important}";

  running = true;
  root.classList.add("theme-dissolve");
  const vt = document.startViewTransition(() => {
    document.head.appendChild(still);
    apply(theme);
  });
  vt.ready
    .then(() => {
      root.animate(frames, { duration: DURATION, fill: "forwards", pseudoElement: "::view-transition-new(root)" });
    })
    .catch(() => {});
  vt.finished.finally(() => {
    still.remove();
    root.classList.remove("theme-dissolve");
    running = false;
    // Saving the choice re-renders React; doing it after the wave keeps the animation smooth.
    commit();
  });
}
