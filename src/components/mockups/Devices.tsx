import type { ReactNode } from "react";

/*
 * Generic, unbranded device frames drawn in CSS: a phone and a laptop.
 * Every size inside is in cqw (percent of the device's width), so a frame looks
 * identical at any size: set the width on the wrapper and the rest follows.
 */

/** Brushed-metal edge: silver by day, graphite at night. */
const METAL =
  "bg-[linear-gradient(140deg,#eef0f3_0%,#a7adb5_22%,#6c727b_48%,#c9cdd3_74%,#8a9099_100%)] dark:bg-[linear-gradient(140deg,#6b707a_0%,#34373e_24%,#1d1f24_50%,#4a4e57_76%,#2a2d33_100%)]";
const BUTTON =
  "absolute rounded-[0.6cqw] bg-[linear-gradient(90deg,#8a9099,#d5d9de,#8a9099)] dark:bg-[linear-gradient(90deg,#2a2d33,#5a5f68,#2a2d33)]";
/** A faint reflection on the glass. Off in dark mode, where it reads as a grey haze over dark screenshots. */
const GLARE =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.07)_0%,transparent_32%)] dark:hidden";

export function Phone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div className="relative aspect-[9/19.5] w-full">
        {/* Volume rocker and power key */}
        <span className={`${BUTTON} top-[19%] -left-[1.3cqw] h-[7%] w-[1.6cqw]`} />
        <span className={`${BUTTON} top-[28%] -left-[1.3cqw] h-[7%] w-[1.6cqw]`} />
        <span className={`${BUTTON} top-[24%] -right-[1.3cqw] h-[11%] w-[1.6cqw]`} />

        <div
          className={`absolute inset-0 rounded-[16cqw] p-[1.3cqw] shadow-[0_40px_70px_-30px_rgb(0_0_0/0.55),0_18px_30px_-18px_rgb(0_0_0/0.35)] ${METAL}`}
        >
          <div className="h-full rounded-[14.8cqw] bg-[#050506] p-[2.6cqw] shadow-[inset_0_0_0_0.35cqw_rgb(255_255_255/0.06)]">
            <div className="relative h-full overflow-hidden rounded-[12.4cqw] bg-black">
              {children}
              {/* Punch-hole camera */}
              <span className="absolute top-[2.6cqw] left-1/2 size-[3.8cqw] -translate-x-1/2 rounded-full bg-[#050506] shadow-[inset_0_0_0_0.7cqw_#14161a]" />
              <span className={GLARE} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Laptop({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`@container relative ${className}`}>
      {/* Lid: a thin aluminum rim around a black bezel */}
      <div className={`mx-auto w-[84%] rounded-t-[2.3cqw] p-[0.32cqw] ${METAL}`}>
        <div className="relative rounded-t-[2cqw] bg-[#050506] px-[1.2cqw] pt-[1.7cqw] pb-[1.5cqw]">
          <span className="absolute top-[0.6cqw] left-1/2 size-[0.55cqw] -translate-x-1/2 rounded-full bg-[#1b1e23] shadow-[inset_0_0_0_0.15cqw_#2c3038]" />
          <div className="relative aspect-[16/10] overflow-hidden rounded-[0.35cqw] bg-black">
            {children}
            <span className={GLARE} />
          </div>
        </div>
      </div>
      {/* Hinge */}
      <div className="mx-auto h-[0.55cqw] w-[84%] bg-[linear-gradient(180deg,#2a2d33,#4b5058)]" />
      {/* Base deck with the thumb notch */}
      <div
        className="relative h-[2cqw] w-full rounded-t-[0.35cqw] rounded-b-[1.8cqw] bg-[linear-gradient(180deg,#f1f3f5_0%,#cdd2d7_40%,#9da3aa_100%)] shadow-[inset_0_0.18cqw_0_rgb(255_255_255/0.9)] dark:bg-[linear-gradient(180deg,#5a5f68_0%,#3a3e45_40%,#1f2126_100%)] dark:shadow-[inset_0_0.18cqw_0_rgb(255_255_255/0.18)]"
      >
        <span className="absolute top-0 left-1/2 h-[0.75cqw] w-[13cqw] -translate-x-1/2 rounded-b-[0.9cqw] bg-[linear-gradient(180deg,#a3a9b0,#cfd4d9)] dark:bg-[linear-gradient(180deg,#26292e,#40444b)]" />
      </div>
      {/* Contact shadow on the surface it sits on */}
      <span className="absolute -bottom-[2cqw] left-[6%] -z-10 h-[3cqw] w-[88%] rounded-[50%] bg-black/30 blur-[1.6cqw]" />
    </div>
  );
}
