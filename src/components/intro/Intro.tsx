/**
 * Intro on every full page load: the KM monogram draws itself, and only when the clip has finished
 * does the curtain lift and the page's entrance animations start.
 * The clip has a white background; blending drops it onto the page color. In dark mode it is inverted
 * (black strokes turn white) and the hue turned back, so the blue stays blue.
 * Skipped for reduced motion. Moving between pages inside the site never replays it.
 */

// Before paint: skip for reduced motion, otherwise mark the intro as playing (holds scroll and entrances).
const START = `try{var d=document.documentElement;d.dataset.intro=matchMedia('(prefers-reduced-motion: reduce)').matches?'skip':'playing'}catch(e){}`;

// Right after the video element: lift when it ends. Safety nets: no playback within 2.5 s (blocked or slow
// network), an error, or a hard cap, so the site can never stay hidden behind the curtain.
const FINISH = `(function(){var d=document.documentElement;if(d.dataset.intro!=='playing')return;var v=document.querySelector('.intro-video');var t=[];function done(){if(d.dataset.intro!=='playing')return;t.forEach(clearTimeout);d.dataset.intro='done'}if(!v){done();return}v.addEventListener('ended',function(){t.push(setTimeout(done,250))});v.addEventListener('error',done);v.addEventListener('playing',function(){t.push(setTimeout(done,((v.duration||3)*1000)+800))},{once:true});t.push(setTimeout(function(){if(v.paused||v.currentTime===0)done()},2500));t.push(setTimeout(done,9000))})()`;

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
