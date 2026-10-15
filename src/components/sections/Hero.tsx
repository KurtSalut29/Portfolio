import Image from "next/image";
import Link from "next/link";
import { ArrowDownIcon, FileTextIcon } from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/content/profile";
import { Container } from "@/components/ui/Section";
import { SectionLink } from "@/components/nav/SectionLink";
import { Hearts } from "@/components/nav/Hearts";

const step = (i: number) => ({ "--i": i }) as React.CSSProperties;
const SANS = { fontFamily: "var(--font-geist-sans), ui-sans-serif, sans-serif" };

/** Kurt, free-standing: no frame, a soft navy glow behind, the bottom fading into the page. */
function Portrait() {
  return (
    <figure className="hero-portrait enter relative mx-auto w-[240px] sm:w-full" style={step(1)}>
      <div className="relative aspect-[4/5]">
        <div aria-hidden="true" className="hero-glow absolute inset-x-[6%] top-[12%] bottom-[18%] rounded-full" />
        {/* The box reaches above the frame: the image has headroom so the hair is never cut when it scales on hover */}
        <div className="hero-cutout absolute inset-x-0 -top-[8.5%] bottom-0">
          <Image
            src="/profile/portrait-cutout.webp"
            alt={`Portrait of ${profile.fullName}`}
            fill
            unoptimized
            loading="eager"
            sizes="280px"
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </figure>
  );
}

/**
 * Home: the thesis beside a free-standing portrait, then the longer story underneath.
 * One accent word in italic serif; the portrait is the only image on the page's first screen.
 */
export function Hero() {
  return (
    <section id="home" className="pt-10 pb-14 sm:pt-20 lg:pt-24 lg:pb-20">
      <Container>
        <div className="grid items-end gap-x-10 gap-y-10 sm:grid-cols-[1fr_260px]">
          <div className="order-2 sm:order-1">
            <div className="enter flex items-center gap-3" style={step(0)}>
              {/* KM monogram: dark letters on light, light letters on dark */}
              <span className="relative h-[28px] w-[42px] shrink-0">
                <Image src="/brand/km-mark-light.png" alt="" fill unoptimized className="object-contain dark:hidden" />
                <Image src="/brand/km-mark-dark.png" alt="" fill unoptimized className="hidden object-contain dark:block" />
              </span>
              <div className="min-w-0 border-l border-line pl-3">
              <p className="text-lg font-semibold tracking-[-0.015em] text-ink">{profile.fullName}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[15px] text-ink-3">
                {profile.role}
                {profile.availability.open && (
                  <>
                    <span aria-hidden="true" className="hidden sm:inline">·</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="status-dot" aria-hidden="true" />
                      {profile.availability.short}
                    </span>
                  </>
                )}
              </p>
              </div>
            </div>

            <h1
              className="enter mt-6 text-[2.125rem] leading-[1.12] font-medium tracking-[-0.03em] text-ink sm:mt-8 sm:text-[2.625rem]"
              style={{ ...step(2), ...SANS }}
            >
              {profile.hero.lead}{" "}
              <span className="font-serif text-[1.08em] font-normal tracking-[-0.01em] italic">{profile.hero.accent}</span>
            </h1>

            <div className="enter mt-8 flex flex-wrap items-center gap-3" style={step(3)}>
              <SectionLink to="projects" className="btn btn-primary">
                See my projects
                <ArrowDownIcon size={15} weight="bold" aria-hidden="true" className="btn-arrow" />
              </SectionLink>
              <Link href={profile.resumeHref} transitionTypes={["nav-forward"]} className="btn btn-secondary">
                <FileTextIcon size={16} aria-hidden="true" />
                Resume
              </Link>
            </div>

            <div className="enter mt-6" style={step(3)}>
              <Hearts />
            </div>
          </div>

          <div className="order-1 sm:order-2">
            <Portrait />
          </div>
        </div>

        {/* Story */}
        <p
          className="enter mt-12 border-t border-line pt-8 text-[1.0625rem] leading-[1.8] text-ink-2 sm:mt-14"
          style={step(4)}
        >
          {profile.hero.intro}
        </p>
      </Container>
    </section>
  );
}
