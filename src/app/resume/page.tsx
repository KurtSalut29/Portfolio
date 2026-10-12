import type { Metadata } from "next";
import { ViewTransition } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/content/profile";
import { getProject } from "@/content/projects";
import { certificates } from "@/content/certificates";
import { skillGroups } from "@/content/site";
import { resume } from "@/content/resume";
import { Container } from "@/components/ui/Section";
import { SectionLink } from "@/components/nav/SectionLink";
import { ResumeActions } from "./PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.fullName}, software developer: selected projects, technical skills, education, and certifications.`,
  alternates: { canonical: "/resume" },
};

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[inherit] border-b border-[#0d1626]/40 pb-1 text-[13px] font-bold tracking-[0.06em] text-[#0d1626] uppercase">{children}</h2>
  );
}

/** A real profile link, not a placeholder like "https://github.com/". */
const isReal = (href: string) => {
  try {
    const u = new URL(href);
    return u.protocol.startsWith("http") && u.pathname.replace(/\/+$/, "") !== "";
  } catch {
    return false;
  }
};

/**
 * A one-page resume in a plain, single-column layout that applicant tracking systems read cleanly.
 * Content is picked in src/content/resume.ts; it does not list every project on the site.
 */
export default function ResumePage() {
  const projects = resume.projects.map((r) => ({ ...r, project: getProject(r.slug) })).filter((r) => r.project);
  const links = profile.socials.filter((s) => s.icon !== "email" && isReal(s.href));
  const certs = certificates.slice(0, resume.certificationsShown);

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div className="print-shell pb-16">
        {/* Sticky action bar */}
        <div className="no-print sticky top-16 z-30 border-b border-line bg-bg/80 backdrop-blur-xl lg:top-0">
          <Container width="document" className="flex h-16 items-center justify-between gap-4">
            <SectionLink
              to="home"
              className="group inline-flex items-center gap-2 text-sm text-[#0d1626]-2 transition-colors hover:text-[#0d1626]"
            >
              <ArrowLeftIcon size={16} aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back to portfolio</span>
              <span className="sm:hidden">Back</span>
            </SectionLink>
            <ResumeActions />
          </Container>
        </div>

        <Container width="document" className="mt-8 print:mt-0 print:max-w-none print:px-0">
          {/* The sheet: always paper-white, like the printed copy */}
          <article className="resume-sheet enter mx-auto font-[Arial,Helvetica,sans-serif] max-w-[820px] rounded-[6px] bg-white px-6 py-9 text-[13.5px] leading-[1.5] text-[#1d2330] shadow-[var(--card-shadow-lift)] sm:px-12 sm:py-12 print:max-w-none print:rounded-none print:p-0 print:shadow-none">
            <header className="text-center">
              <h1 className="font-[inherit] text-[30px] leading-tight font-bold tracking-[0.01em] text-[#0d1626] uppercase">{profile.fullName}</h1>
              <p className="mt-0.5 text-[14.5px] font-semibold text-[#3a4252]">{profile.role}</p>
              <p className="mt-1 flex flex-wrap justify-center gap-x-2 text-[13px] text-[#3a4252]">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <span aria-hidden="true">|</span>
                <span>{profile.location}</span>
                {links.map((s) => (
                  <span key={s.label} className="contents">
                    <span aria-hidden="true">|</span>
                    <a href={s.href} target="_blank" rel="noreferrer">
                      {s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </a>
                  </span>
                ))}
              </p>
            </header>

            <section className="mt-5">
              <H>Professional Summary</H>
              <p className="mt-1.5">{resume.summary}</p>
            </section>

            <section className="mt-4">
              <H>Selected Projects</H>
              <ul className="mt-1.5 space-y-2.5">
                {projects.map(({ slug, label, bullets, project: p }) => (
                  <li key={slug}>
                    <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="font-bold text-[#0d1626]">
                        {p!.name} - {p!.short}
                        {p!.stack.length > 0 && (
                          <span className="font-normal text-[#4a5262]"> | {p!.stack.join(", ")}</span>
                        )}
                      </span>
                      <span className="font-bold text-[#0d1626]">
                        {label}
                        {p!.year && `, ${p!.year}`}
                      </span>
                    </p>
                    <ul className="mt-0.5 list-disc space-y-0.5 pl-5 marker:text-[#4a5262]">
                      {bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-4">
              <H>Technical Skills</H>
              <ul className="mt-1.5 space-y-0.5">
                {skillGroups.map((g) => (
                  <li key={g.title}>
                    <span className="font-bold text-[#0d1626]">{g.title}:</span> {g.items.map((i) => i.name).join(", ")}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-4">
              <H>Education</H>
              <p className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="font-bold text-[#0d1626]">
                  {profile.education.school} - {profile.education.degree}
                </span>
                <span className="font-bold text-[#0d1626]">
                  {profile.education.start} - {profile.education.end}
                </span>
              </p>
            </section>

            <section className="mt-4">
              <H>Certifications</H>
              <ul className="mt-1.5 space-y-0.5">
                {certs.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span>
                      <span className="font-bold text-[#0d1626]">{c.title}</span> - {c.issuer}
                    </span>
                    <time dateTime={c.iso} className="text-[#4a5262]">
                      {c.date.replace(/^(\w{3}) \d{1,2}, /, "$1 ")}
                    </time>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </Container>
      </div>
    </ViewTransition>
  );
}
