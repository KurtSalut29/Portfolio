import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CircleCheck } from "lucide-react";
import {
  getProject,
  projects,
  type Project,
  type Shot,
} from "@/content/projects";
import { profile } from "@/content/profile";
import { ProjectGlyph } from "@/components/icons/ProjectGlyph";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Footer } from "@/components/sections/Footer";
import { SectionLink } from "@/components/nav/SectionLink";
import { CaseToc } from "@/components/case/CaseToc";
import { DeviceStage } from "@/components/mockups/DeviceStage";
import { ScreenshotViewer } from "@/components/mockups/ScreenshotViewer";
import { ThemedImage } from "@/components/mockups/screens";
import { PLATFORM } from "@/components/mockups/platform";
import { StackList } from "@/components/icons/StackList";

const SANS = {
  fontFamily: "var(--font-geist-sans), ui-sans-serif, sans-serif",
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.name}: ${project.short}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title, description: project.summary, url: `/projects/${project.slug}` },
  };
}

/** The device mockup on a soft stage tinted with the project's color. */
function Stage({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-card)] border border-line ${className}`}
      style={{
        background: `radial-gradient(70% 55% at 50% 105%, ${project.cover.glow}38, transparent 72%), linear-gradient(180deg, var(--surface), var(--surface-2))`,
      }}
    >
      <DeviceStage project={project} />
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl font-medium tracking-[-0.015em] text-ink sm:text-[1.75rem]"
      style={SANS}
    >
      {children}
    </h2>
  );
}

function SiblingCard({
  project,
  dir,
}: {
  project: Project;
  dir: "prev" | "next";
}) {
  const next = dir === "next";
  return (
    <Link
      href={`/projects/${project.slug}`}
      transitionTypes={[next ? "nav-forward" : "nav-back"]}
      className="group block rounded-[var(--radius-card)] border border-line bg-surface p-3 transition-[border-color] duration-300 hover:border-line-strong"
    >
      <Stage project={project} className="aspect-[16/10] border-0" />
      <span
        className={`flex items-center gap-3 px-2 pt-4 pb-1 ${next ? "flex-row-reverse text-right" : ""}`}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition-colors duration-300 group-hover:border-ink-3 group-hover:text-ink">
          {next ? (
            <ArrowRight
              size={16}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          ) : (
            <ArrowLeft
              size={16}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-ink-3">
            {next ? "Next project" : "Previous project"}
          </span>
          <span
            className="mt-0.5 block truncate font-medium text-ink"
            style={SANS}
          >
            {project.name} <span className="text-ink-3">— {project.short}</span>
          </span>
        </span>
      </span>
    </Link>
  );
}

export default async function ProjectPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const platform = PLATFORM[project.platform];
  const screens = (["web", "mobile"] as const).filter(
    (k) => project.screens?.[k],
  );
  // Every screenshot with its caption: the project's gallery, or one per device from `screens`.
  const shots =
    project.gallery?.map((g) => ({
      shot: g.src as Shot,
      caption: g.caption,
      kind: g.kind,
    })) ??
    screens.map((k) => ({
      shot: project.screens![k]!,
      caption: k === "web" ? "Web dashboard" : "Mobile app",
      kind: k,
    }));
  const themed = shots.some((s) => typeof s.shot !== "string");

  // Only what is known is shown; unset details are left out rather than guessed.
  const meta = [
    { label: "Role", value: project.role },
    { label: "Team", value: project.team },
    { label: "Timeline", value: project.timeline },
    { label: "Status", value: project.status },
    { label: "Platform", value: platform.label },
  ].filter((m): m is { label: string; value: string } => Boolean(m.value));

  const toc = [
    { id: "problem", label: "The problem" },
    { id: "built", label: "What I built" },
    ...(shots.length ? [{ id: "screens", label: "Screens" }] : []),
    ...(project.outcomes?.length
      ? [{ id: "outcomes", label: "Outcomes" }]
      : []),
    ...(project.lessons ? [{ id: "learned", label: "What I learned" }] : []),
  ];

  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <article className="pt-10 sm:pt-16 lg:pt-20">
        <Container>
          <SectionLink
            to="projects"
            className="group inline-flex items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-ink"
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-x-0.5"
            />
            All projects
          </SectionLink>

          {/* Header: who, what, and one sentence on why it matters */}
          <header className="mt-10">
            <div
              className="enter flex items-center gap-4"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <span
                className="grid size-14 shrink-0 place-items-center rounded-[16px] shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
                style={{
                  background: `linear-gradient(140deg, ${project.cover.glow}, ${project.cover.glow}c0)`,
                }}
              >
                <ProjectGlyph icon={project.icon} size={28} color="#fff" />
              </span>
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-ink-3">
                <span className="inline-flex items-center gap-1.5 font-medium text-ink-2">
                  <platform.icon
                    size={15}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {platform.label}
                </span>
                {[project.year, project.status].filter(Boolean).map((v) => (
                  <span key={v} className="contents">
                    <span aria-hidden="true">·</span>
                    {v}
                  </span>
                ))}
              </p>
            </div>
            <h1
              className="enter mt-7 text-[2.25rem] leading-[1.1] font-medium tracking-[-0.03em] text-ink sm:text-[2.875rem]"
              style={{ ...SANS, "--i": 1 } as React.CSSProperties}
            >
              {project.name}{" "}
              <span className="text-ink-3">— {project.short}</span>
            </h1>
            <p
              className="enter mt-5 text-[1.0625rem] leading-[1.75] text-ink-2 sm:text-lg"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {project.summary}
            </p>
            <ul
              className="enter mt-5 flex flex-wrap gap-1.5"
              aria-label="Highlights"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              {project.badges.map((b) => (
                <li key={b} className="chip">
                  {b}
                </li>
              ))}
            </ul>
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary mt-7"
              >
                Visit live site
                <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            )}
          </header>

          <div
            className="enter relative mt-10"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            <Stage project={project} className="aspect-[16/11]" />
            <ScreenshotViewer project={project} />
          </div>

          <Reveal>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 border-t border-line sm:grid-cols-3">
              {meta.map((m) => (
                <div key={m.label} className="border-b border-line py-4">
                  <dt className="text-xs text-ink-3">{m.label}</dt>
                  <dd className="mt-1 text-[15px] text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
            {project.stack.length > 0 && (
              <div className="border-b border-line py-4">
                <p className="text-xs text-ink-3">Stack</p>
                <StackList stack={project.stack} className="mt-2.5" />
              </div>
            )}
          </Reveal>

          <div id="case-body" className="relative mt-20">
            {/* The column stays centered; on wide screens the contents hang in the left margin */}
            <aside className="absolute top-0 right-full bottom-0 mr-10 hidden w-[170px] min-[1400px]:block">
              <CaseToc items={toc} />
            </aside>

            <div className="space-y-20">
              <section id="problem">
                <Reveal>
                  <H2>The problem</H2>
                  <p className="mt-5 text-[1.0625rem] leading-[1.8] text-ink-2">
                    {project.problem}
                  </p>
                </Reveal>
              </section>

              <section id="built">
                <Reveal>
                  <H2>What I built</H2>
                  <p className="mt-5 text-[1.0625rem] leading-[1.8] text-ink-2">
                    {project.solution}
                  </p>
                </Reveal>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {project.features.map((f, i) => (
                    <Reveal
                      as="li"
                      key={f.title}
                      delay={i * 0.06}
                      className="card p-5 sm:[&:last-child:nth-child(odd)]:col-span-2"
                    >
                      <span
                        className="block size-2 rounded-full"
                        style={{ background: project.cover.glow }}
                        aria-hidden="true"
                      />
                      <p className="mt-4 font-medium text-ink" style={SANS}>
                        {f.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                        {f.body}
                      </p>
                    </Reveal>
                  ))}
                </ul>
              </section>

              {shots.length > 0 && (
                <section id="screens">
                  <Reveal>
                    <H2>Screens</H2>
                    <p className="mt-3 text-[15px] text-ink-3">
                      {themed
                        ? "Real screenshots. They follow the light or dark theme you are viewing in."
                        : "Real screenshots from the working system."}
                    </p>
                  </Reveal>
                  {/* Phone screens sit side by side; wide screens get the full column */}
                  <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10">
                    {shots.map((s) => (
                      <Reveal
                        key={`${s.caption}-${s.kind}`}
                        className={s.kind === "web" ? "col-span-2" : ""}
                      >
                        <figure>
                          <div
                            className={`overflow-hidden border border-line bg-surface-2 shadow-[var(--card-shadow)] ${
                              s.kind === "mobile"
                                ? `mx-auto rounded-[28px] ${shots.filter((x) => x.kind === "mobile").length > 1 ? "max-w-[260px]" : "max-w-[300px]"}`
                                : "rounded-[var(--radius-control)]"
                            }`}
                          >
                            <ThemedImage
                              shot={s.shot}
                              alt={`${project.name}: ${s.caption}`}
                            />
                          </div>
                          <figcaption className="mt-3 text-center text-[13px] text-ink-3">
                            {s.caption}
                          </figcaption>
                        </figure>
                      </Reveal>
                    ))}
                  </div>
                </section>
              )}

              {project.outcomes?.length ? (
                <section id="outcomes">
                  <Reveal>
                    <H2>Outcomes</H2>
                  </Reveal>
                  <ul className="mt-6 divide-y divide-line border-y border-line">
                    {project.outcomes.map((o, i) => (
                      <Reveal
                        as="li"
                        key={o}
                        delay={i * 0.06}
                        className="flex gap-3.5 py-4"
                      >
                        <CircleCheck
                          size={20}
                          strokeWidth={1.75}
                          className="mt-0.5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        <span className="text-[1.0625rem] leading-relaxed text-ink">
                          {o}
                        </span>
                      </Reveal>
                    ))}
                  </ul>
                </section>
              ) : null}

              {project.lessons && (
                <section id="learned">
                  <Reveal>
                    <H2>What I learned</H2>
                    <blockquote
                      className="mt-6 border-l-2 pl-5"
                      style={{ borderColor: project.cover.glow }}
                    >
                      <p
                        className="text-xl leading-[1.6] text-ink"
                        style={SANS}
                      >
                        {project.lessons}
                      </p>
                    </blockquote>
                  </Reveal>
                </section>
              )}
            </div>
          </div>

          {/* The reader just finished a case study: give them the next step */}
          <Reveal className="mt-24">
            <div className="flex flex-col items-start justify-between gap-6 border-y border-line py-10 sm:flex-row sm:items-center">
              <div>
                <p
                  className="text-2xl font-medium tracking-[-0.015em] text-ink"
                  style={SANS}
                >
                  Like what you see?
                </p>
                <p className="mt-1.5 text-ink-2">
                  I&apos;m {profile.availability.label.toLowerCase()}.
                </p>
              </div>
              <SectionLink to="contact" className="btn btn-primary">
                Let&apos;s talk
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="btn-arrow"
                  aria-hidden="true"
                />
              </SectionLink>
            </div>
          </Reveal>

          {projects.length > 1 && (
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <Reveal>
                <SiblingCard project={prev} dir="prev" />
              </Reveal>
              <Reveal delay={0.06}>
                <SiblingCard project={next} dir="next" />
              </Reveal>
            </div>
          )}
        </Container>
        <div className="mt-24">
          <Footer />
        </div>
      </article>
    </ViewTransition>
  );
}
