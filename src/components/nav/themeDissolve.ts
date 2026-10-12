/**
 * Theme switch as a pixel dissolve: the new theme spreads out from the toggle that was pressed,
 * square by square, in an ordered (Bayer) dither pattern.
 * Built on the View Transitions API: the browser snapshots the old page, we swap the theme,
 * then step a mask over the new snapshot. Falls back to an instant swap.
 */

const PX = 4; // size of one dither square, in CSS pixels
const STEPS = 28; // mask frames across the animation
const DURATION = 760;

// 4×4 Bayer matrix: spreads each step's new squares evenly instead of in clumps.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Mask frames: frame k shows every square whose threshold is below the k-th step. */
function frames(originX: number, originY: number): Keyframe[] {
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
  const size = `${w * PX}px ${h * PX}px`;

  return Array.from({ length: STEPS + 1 }, (_, k) => {
    const cut = easeOut(k / STEPS) * 1.01;
    for (let i = 0; i < threshold.length; i++) img.data[i * 4 + 3] = threshold[i] < cut ? 255 : 0;
    ctx.putImageData(img, 0, 0);
    const url = `url(${canvas.toDataURL()})`;
    return { maskImage: url, WebkitMaskImage: url, maskSize: size, WebkitMaskSize: size, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" };
  });
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

  const r = origin.getBoundingClientRect();
  // Built before the snapshot, so the first frame is ready the moment the transition starts.
  const keyframes = frames(r.left + r.width / 2, r.top + r.height / 2);
  const root = document.documentElement;

  // Color transitions would let the new snapshot catch the old colors mid-fade; hold them off for the swap.
  const still = document.createElement("style");
  still.textContent = "*,*::before,*::after{transition:none!important}";

  root.classList.add("theme-dissolve");
  const vt = (current = document.startViewTransition(() => {
    document.head.appendChild(still);
    apply(theme);
    commit();
  }));
  vt.ready
    .then(() => {
      root.animate(keyframes, { duration: DURATION, easing: "linear", pseudoElement: "::view-transition-new(root)" });
    })
    .catch(() => {});
  vt.finished.finally(() => {
    still.remove();
    // A quick second press starts a new transition; leave the class for that one.
    if (current === vt) root.classList.remove("theme-dissolve");
  });
}
