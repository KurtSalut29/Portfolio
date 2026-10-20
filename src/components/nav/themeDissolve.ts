/**
 * Theme switch as a pixel dissolve: the new theme spreads out from the toggle that was pressed,
 * square by square, in an ordered (Bayer) dither pattern.
 * Built on the View Transitions API: the browser snapshots the old page, we swap the theme,
 * then step a mask over the new snapshot. Falls back to an instant swap.
 */

const PX = 4; // size of one dither square, in CSS pixels
const STEPS = 22; // mask frames across the animation
const DURATION = 620;

// 4×4 Bayer matrix: spreads each step's new squares evenly instead of in clumps.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** One mask frame per step: frame k shows every square whose threshold is below the k-th cut. */
function setup(originX: number, originY: number) {
  const w = Math.ceil(innerWidth / PX);
  const h = Math.ceil(innerHeight / PX);
  const ox = originX / PX;
  const oy = originY / PX;
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
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const draw = (k: number) => {
    const cut = easeOut(k / STEPS) * 1.01;
    for (let i = 0; i < threshold.length; i++) img.data[i * 4 + 3] = threshold[i] < cut ? 255 : 0;
    ctx.putImageData(img, 0, 0);
    return canvas;
  };
  return { draw, size: `${w * PX}px ${h * PX}px` };
}

const keyframe = (url: string, size: string): Keyframe => {
  const mask = `url(${url})`;
  return { maskImage: mask, WebkitMaskImage: mask, maskSize: size, WebkitMaskSize: size, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" };
};

/** Where a press would start the wave (to the nearest 24px, close enough to look exact), plus the viewport it was built for. */
function keyFor(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  return { x, y, key: `${innerWidth}x${innerHeight}@${Math.round(x / 24)},${Math.round(y / 24)}` };
}

/*
 * Building the frames takes a moment (22 images), and doing it on the click made the switch wait.
 * So they are built ahead of time, off the click: when the toggle is hovered or focused, or when the page
 * is idle. Each frame is encoded without blocking and decoded up front, so playback only swaps images.
 */
let ready: { key: string; frames: Keyframe[]; urls: string[] } | null = null;
let building: string | null = null;

export function prepareDissolve(el: HTMLElement) {
  if (typeof document === "undefined" || !document.startViewTransition) return;
  const { x, y, key } = keyFor(el);
  if (ready?.key === key || building === key) return;
  building = key;
  void (async () => {
    const { draw, size } = setup(x, y);
    const urls: string[] = [];
    for (let k = 0; k <= STEPS; k++) {
      const blob = await new Promise<Blob | null>((res) => draw(k).toBlob(res));
      if (!blob || building !== key) {
        urls.forEach(URL.revokeObjectURL);
        return;
      }
      const url = URL.createObjectURL(blob);
      urls.push(url);
      const im = new Image();
      im.src = url;
      await im.decode().catch(() => {});
    }
    if (building !== key) {
      urls.forEach(URL.revokeObjectURL);
      return;
    }
    const old = ready;
    ready = { key, urls, frames: urls.map((u) => keyframe(u, size)) };
    building = null;
    // Old frames may still be on screen for a moment; free them once the current switch is surely over.
    if (old) setTimeout(() => old.urls.forEach(URL.revokeObjectURL), DURATION * 2);
  })();
}

/** Fallback when nothing was prepared (e.g. a keyboard press right after load): build synchronously. */
function framesNow(x: number, y: number): Keyframe[] {
  const { draw, size } = setup(x, y);
  return Array.from({ length: STEPS + 1 }, (_, k) => keyframe(draw(k).toDataURL(), size));
}

let current: ViewTransition | null = null;

function apply(theme: string) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}

/**
 * Switch to `theme`, dissolving outward from `origin` (the pressed button).
 * `commit` saves the choice (next-themes' setTheme), which then re-applies the same attribute.
 */
export function dissolveTheme(theme: string, origin: HTMLElement, commit: () => void) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) {
    apply(theme);
    commit();
    return;
  }

  const { x, y, key } = keyFor(origin);
  const keyframes = ready?.key === key ? ready.frames : framesNow(x, y);
  const root = document.documentElement;

  // Color transitions would let the new snapshot catch the old colors mid-fade; hold them off for the swap.
  const still = document.createElement("style");
  still.textContent = "*,*::before,*::after{transition:none!important}";

  root.classList.add("theme-dissolve");
  const vt = (current = document.startViewTransition(() => {
    document.head.appendChild(still);
    apply(theme);
  }));
  vt.ready
    .then(() => {
      root.animate(keyframes, { duration: DURATION, easing: "linear", pseudoElement: "::view-transition-new(root)" });
    })
    .catch(() => {});
  vt.finished.finally(() => {
    still.remove();
    // Saving the choice re-renders React; doing it after the wave keeps the animation smooth.
    commit();
    // A quick second press starts a new transition; leave the class for that one.
    if (current === vt) root.classList.remove("theme-dissolve");
  });
}
