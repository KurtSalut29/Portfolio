import Link from "next/link";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/content/profile";
import { nav } from "@/content/site";
import { projects } from "@/content/projects";
import { gallery } from "@/content/gallery";
import { Container } from "@/components/ui/Section";
import { SectionLink } from "@/components/nav/SectionLink";
import { SocialLinks } from "@/components/nav/SocialLinks";

export function Footer() {
  return (
    <footer className="no-print relative isolate overflow-hidden border-t border-line pt-16">
      <Container>
        <div className="grid gap-10 sm:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-ink">{profile.fullName}</p>
            <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-2">{profile.headline}</p>
            <a href={`mailto:${profile.email}`} className="link-underline mt-5 inline-block text-[15px] font-medium text-accent">
              {profile.email}
            </a>
            <SocialLinks className="-mx-2 mt-4" />
          </div>
          <nav aria-label="Footer">
            <p className="label-mono">Explore</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[15px] sm:grid-cols-1">
              {nav
                .filter((n) => n.id !== "gallery" || gallery.length > 0)
                .map((n) => (
                  <li key={n.id}>
                    {"href" in n ? (
                      <Link href={n.href} transitionTypes={["nav-forward"]} className="link-underline text-ink-2 hover:text-ink">
                        {n.label}
                      </Link>
                    ) : (
                      <SectionLink to={n.id} className="link-underline text-ink-2 hover:text-ink">
                        {n.label}
                      </SectionLink>
                    )}
                  </li>
                ))}
            </ul>
          </nav>
          <div>
            <p className="label-mono">Projects</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    transitionTypes={["nav-forward"]}
                    className="link-underline text-ink-2 hover:text-ink"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={profile.resumeHref} transitionTypes={["nav-forward"]} className="link-underline text-ink-2 hover:text-ink">
                  Resume
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Closing wordmark */}
      <div className="relative mt-24">
        <Container>
          <p
            aria-hidden="true"
            className="font-display text-[clamp(3rem,15vw,5.75rem)] leading-[0.82] font-bold tracking-[-0.06em] text-ink/[0.06] select-none"
          >
            Keep building
          </p>
          <div className="flex flex-col items-start justify-between gap-3 border-t border-line/70 py-6 text-[13px] text-ink-3 sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} {profile.fullName}. Designed and built from scratch.
            </p>
            <SectionLink to="home" className="link-underline inline-flex items-center gap-1.5 text-ink-2 hover:text-ink">
              Back to top
              <ArrowUpIcon size={14} aria-hidden="true" />
            </SectionLink>
          </div>
        </Container>
      </div>
    </footer>
  );
}
