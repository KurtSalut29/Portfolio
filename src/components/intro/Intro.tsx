/**
 * Intro on every full page load: the KM monogram draws itself, and once it is drawn the curtain lifts
 * and the page's entrance animations start.
 * The clip has a white background; blending drops it onto the page color. In dark mode it is inverted
 * (black strokes turn white) and the hue turned back, so the blue stays blue.
 * Skipped for reduced motion. Moving between pages inside the site never replays it.
 */

// Before paint: skip for reduced motion, otherwise mark the intro as playing (holds scroll and entrances).
const START = `try{var d=document.documentElement;d.dataset.intro=matchMedia('(prefers-reduced-motion: reduce)').matches?'skip':'playing'}catch(e){}`;

// Right after the video element: lift as soon as the monogram is drawn (at about 1.85 s of the 3 s clip; the
// rest is a still frame), with a short beat to read it. Safety nets: an error, no playback within 2.5 s
// (blocked or slow network), and a hard cap, so the site can never stay hidden behind the curtain.
const LIFT_AT = 2.0;
const FINISH = `(function(){var d=document.documentElement;if(d.dataset.intro!=='playing')return;var v=document.querySelector('.intro-video');var t=[];function done(){if(d.dataset.intro!=='playing')return;t.forEach(clearTimeout);d.dataset.intro='done'}if(!v){done();return}function arm(){t.push(setTimeout(done,Math.max(0,${LIFT_AT}-v.currentTime)*1000))}if(!v.paused&&v.currentTime>0)arm();else v.addEventListener('playing',arm,{once:true});v.addEventListener('ended',done);v.addEventListener('error',done);t.push(setTimeout(function(){if(v.paused||v.currentTime===0)done()},2500));t.push(setTimeout(done,6000))})()`;

export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: START }} />
      <noscript>
        <style>{`.intro{display:none}`}</style>
      </noscript>
      <div className="intro no-print grid place-items-center" aria-hidden="true">
        <video className="intro-video" src="/brand/km-splash.mp4" autoPlay muted playsInline preload="auto" />
      </div>
      <script dangerouslySetInnerHTML={{ __html: FINISH }} />
    </>
  );
}
