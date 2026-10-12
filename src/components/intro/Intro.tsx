/**
 * Intro on every page load: the KM monogram draws itself, then the curtain lifts.
 * The clip has a white background; blending drops it onto the page color. In dark mode it is inverted
 * (black strokes turn white) and the hue turned back, so the blue stays blue.
 * Skipped for reduced motion. Pure CSS timing, so it plays while the page hydrates.
 */
// Plays on every full page load (a refresh included); moving between pages inside the site never replays it.
const SKIP_SCRIPT = `try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='skip'}catch(e){}`;

export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SKIP_SCRIPT }} />
      <div className="intro no-print grid place-items-center" aria-hidden="true">
        <video className="intro-video" src="/brand/km-splash.mp4" autoPlay muted playsInline preload="auto" />
      </div>
    </>
  );
}
