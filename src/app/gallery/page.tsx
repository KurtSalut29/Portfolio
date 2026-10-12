import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gallery } from "@/content/gallery";
import { profile } from "@/content/profile";
import { Container } from "@/components/ui/Section";
import { PhotoStack } from "@/components/gallery/PhotoStack";
import { SectionLink } from "@/components/nav/SectionLink";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of Kurt Michael Salut away from the keyboard: campus days, the outdoors, and everyday moments.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div>
        <Container className="pt-10 pb-20 lg:pt-16">
          <Link
            href="/"
            transitionTypes={["nav-back"]}
            className="inline-flex items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            Home
          </Link>

          <section id="photos" className="mt-10">
            <h1 className="text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-[2.875rem]">
              Beyond the <span className="font-serif font-normal italic">code.</span>
            </h1>

            <div className="mt-12">
              {gallery.length > 0 ? (
                <PhotoStack photos={gallery} />
              ) : (
                <p className="rounded-[var(--radius-card)] border border-dashed border-line-strong p-10 text-center text-ink-3">
                  Photos are on the way.
                </p>
              )}
            </div>
          </section>

          {/* The person behind the photos */}
          <section id="me" className="mt-16" aria-labelledby="me-title">
            <h2 id="me-title" className="text-xl font-semibold tracking-tight text-ink">
              {profile.fullName}
            </h2>
            <p className="mt-0.5 text-ink-3">{profile.role}</p>
            <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-ink-2">
              {profile.about.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <SectionLink to="contact" className="btn btn-secondary mt-7">
              Get in touch
              <ArrowRight size={16} strokeWidth={2} className="btn-arrow" aria-hidden="true" />
            </SectionLink>
          </section>
        </Container>
        <Footer />
      </div>
    </ViewTransition>
  );
}
