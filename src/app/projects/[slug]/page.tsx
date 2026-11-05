import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  getProject,
  projects,
  type Project,
  type Shot,
} from "@/content/projects";
import { profile } from "@/content/profile";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Footer } from "@/components/sections/Footer";
import { SectionLink } from "@/components/nav/SectionLink";
import { CaseToc } from "@/components/case/CaseToc";
import { ScreenshotViewer } from "@/components/mockups/ScreenshotViewer";
import { ThemedImage } from "@/components/mockups/screens";
import { PLATFORM } from "@/components/mockups/platform";
import { StackList } from "@/components/icons/StackList";
import {
  leadShots,
  ProjectMedia,
  ProjectThumb,
} from "@/components/projects/ProjectMedia";

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

/** A case-study section: a quiet label in the margin column, the content beside it. */
function Block({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <Reveal className="grid gap-3 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-8">
        <h2 className="font-sans text-sm font-medium tracking-normal text-ink-3 sm:pt-1">
          {label}
        </h2>
        <div>{children}</div>
      </Reveal>
    </section>
  );
}

function SiblingRow({
  project,
  dir,
}: {
  project: Project;
  dir: "prev" | "next";
}) {
  const next = dir === "next";
  const Arrow = next ? ArrowRight : ArrowLeft;
  return (
    <Link
      href={`/projects/${project.slug}`}
      transitionTypes={[next ? "nav-forward" : "nav-back"]}
      className="group flex items-center gap-4 py-3.5"
    >
      <ProjectThumb project={project} />
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-ink-3">
          {next ? "Next project" : "Previous project"}
        </span>
        <span className="mt-0.5 block truncate font-medium text-ink">
          {project.name}{" "}
          <span className="ml-1 font-normal text-ink-3">{project.short}</span>
        </span>
      </span>
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition-[color,border-color] duration-200 group-hover:border-line-strong group-hover:text-ink">
        <Arrow
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className={`transition-transform duration-200 ease-[var(--ease-out)] ${next ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5"}`}
        />
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

  // The lead image already shows these screens, so the Screens section only adds the others.
  const lead = leadShots(project);
  const leadSrcs = [lead.web, ...lead.phones];
  const moreShots = (project.gallery ?? [])
    .filter((g) => !leadSrcs.includes(g.src as Shot))
    .map((g) => ({ shot: g.src as Shot, caption: g.caption, kind: g.kind }));
  const leadCaption = project.gallery?.find((g) =>
    leadSrcs.includes(g.src as Shot),
  )?.caption;

  // Only what is known is shown; unset details are left out rather than guessed.
  const facts = [
    { label: "Role", value: project.role },
    { label: "Team", value: project.team },
    { label: "Timeline", value: project.timeline ?? project.year },
    { label: "Status", value: project.status },
    { label: "Platform", value: platform.label },
  ].filter((m): m is { label: string; value: string } => Boolean(m.value));

  const toc = [
    { id: "problem", label: "The problem" },
    { id: "built", label: "What I built" },
    ...(moreShots.length ? [{ id: "screens", label: "Screens" }] : []),
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

          <header className="mt-10">
            <h1
              className="enter text-[2.75rem] leading-[1.04] font-semibold tracking-[-0.03em] text-ink sm:text-[3.5rem]"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              {project.name}
            </h1>
            <p
              className="enter mt-2 text-xl text-ink-3 sm:text-2xl"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              {project.short}
            </p>
            <p
              className="enter mt-6 text-[1.0625rem] leading-[1.75] text-ink-2 sm:text-lg"
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
          </header>

          <figure
            className="enter enter-solid mt-9"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            <ProjectMedia project={project} />
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[13px] text-ink-3">
              <span>{leadCaption}</span>
              <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <ScreenshotViewer project={project} />
                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-ink-2 hover:text-ink"
                  >
                    <span className="link-underline">Live site</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
                {project.links?.repo && (
                  <a
                    href={project.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-ink-2 hover:text-ink"
                  >
                    <span className="link-underline">Source on GitHub</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
              </span>
            </figcaption>
          </figure>

          <Reveal className="mt-10 border-y border-line py-6">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
              {facts.map((m) => (
                <div key={m.label}>
                  <dt className="text-xs text-ink-3">{m.label}</dt>
                  <dd className="mt-1 text-[15px] text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
            {project.stack.length > 0 && (
              <div className="mt-5">
                <p className="text-xs text-ink-3">Stack</p>
                <StackList stack={project.stack} className="mt-2.5" />
              </div>
            )}
          </Reveal>

          <div id="case-body" className="relative mt-16">
            {/* The column stays centered; on wide screens the contents hang in the left margin */}
            <aside className="absolute top-0 right-full bottom-0 mr-10 hidden w-[170px] min-[1400px]:block">
              <CaseToc items={toc} />
            </aside>

            <div className="space-y-16">
              <Block id="problem" label="The problem">
                <p className="text-xl leading-[1.55] tracking-[-0.01em] text-ink">
                  {project.problem}
                </p>
              </Block>

              <Block id="built" label="What I built">
                <p className="text-[1.0625rem] leading-[1.8] text-ink-2">
                  {project.solution}
                </p>
                <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {project.features.map((f, i) => (
                    <Reveal as="li" key={f.title} y={24} delay={i * 0.09}>
                      <h3 className="font-sans text-[15px] font-medium tracking-normal text-ink">
                        {f.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                        {f.body}
                      </p>
                    </Reveal>
                  ))}
                </ul>
              </Block>

              {moreShots.length > 0 && (
                <section id="screens" className="scroll-mt-24">
                  <Reveal>
                    <h2 className="font-sans text-sm font-medium tracking-normal text-ink-3">
                      Screens
                    </h2>
                  </Reveal>
                  {/* Phone screens sit side by side; wide screens get the full column */}
                  <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-9">
                    {moreShots.map((s) => (
                      <Reveal
                        key={s.caption}
                        className={s.kind === "web" ? "col-span-2" : ""}
                      >
                        <figure>
                          <div
                            className={`overflow-hidden border border-line bg-surface-2 ${
                              s.kind === "mobile"
                                ? "mx-auto max-w-[260px] rounded-[24px]"
                                : "rounded-[var(--radius-control)]"
                            }`}
                          >
                            <ThemedImage
                              shot={s.shot}
                              alt={`${project.name}: ${s.caption}`}
                            />
                          </div>
                          <figcaption className="mt-3 text-[13px] text-ink-3">
                            {s.caption}
                          </figcaption>
                        </figure>
                      </Reveal>
                    ))}
                  </div>
                </section>
              )}

              {project.outcomes?.length ? (
                <Block id="outcomes" label="Outcomes">
                  <ul className="space-y-3">
                    {project.outcomes.map((o, i) => (
                      <Reveal
                        as="li"
                        key={o}
                        y={20}
                        delay={i * 0.09}
                        className="text-[1.0625rem] leading-relaxed text-ink"
                      >
                        {o}
                      </Reveal>
                    ))}
                  </ul>
                </Block>
              ) : null}

              {project.lessons && (
                <Block id="learned" label="What I learned">
                  <p className="text-xl leading-[1.55] tracking-[-0.01em] text-ink">
                    {project.lessons}
                  </p>
                </Block>
              )}
            </div>
          </div>

          {/* The reader just finished a case study: give them the next step */}
          <Reveal className="mt-20">
            <div className="flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center">
              <div>
                <p className="text-2xl font-medium tracking-[-0.015em] text-ink">
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
            <Reveal className="mt-10 divide-y divide-line border-y border-line">
              <SiblingRow project={next} dir="next" />
              <SiblingRow project={prev} dir="prev" />
            </Reveal>
          )}
        </Container>
        <div className="mt-24">
          <Footer />
        </div>
      </article>
    </ViewTransition>
  );
}
