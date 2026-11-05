import { Fragment } from "react";
import Image from "next/image";
import type { Project, Shot } from "@/content/projects";

/** The screenshots a project leads with: its web screen, plus a phone or two when it has them. */
export function leadShots(project: Project): { web?: Shot; phones: Shot[] } {
  const web = project.screens?.web;
  const single = project.screens?.mobile ? [project.screens.mobile] : [];
  if (web) return { web, phones: single };
  const fromGallery = project.gallery?.filter((g) => g.kind === "mobile").map((g) => g.src as Shot) ?? [];
  return { phones: fromGallery.length ? fromGallery.slice(0, 2) : single };
}

/** Both images of a light and dark pair render; CSS shows the matching one. */
function themed(shot: Shot, render: (src: string, themeClass: string) => React.ReactNode) {
  if (typeof shot === "string") return render(shot, "");
  return (
    <>
      {render(shot.light, "dark:hidden")}
      {render(shot.dark, "hidden dark:block")}
    </>
  );
}

/** A small real screenshot for lists of projects. */
export function ProjectThumb({ project }: { project: Project }) {
  const { web, phones } = leadShots(project);
  const shot = web ?? phones[0];
  return (
    <span className="relative block h-12 w-[72px] shrink-0 overflow-hidden rounded-[10px] border border-line bg-surface-2">
      {shot &&
        themed(shot, (src, themeClass) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="144px"
            className={`object-cover ${web ? "object-left-top" : "object-top"} ${themeClass}`}
          />
        ))}
    </span>
  );
}

/**
 * The project's real screens on a soft stage tinted with its color. Screens always show whole, at
 * their own proportions, and are never cropped. Files are served as they are because re-encoding
 * blurs small UI text.
 */
export function ProjectMedia({
  project,
  compact = false,
  className = "",
}: {
  project: Project;
  /** For small cards: tighter corners, and screens lift when a `group` ancestor is hovered. */
  compact?: boolean;
  className?: string;
}) {
  const { web, phones } = leadShots(project);
  const frame = "border border-line bg-surface-2 shadow-[var(--card-shadow-lift)]";
  const lift = compact
    ? "transition-transform duration-[500ms] ease-[var(--ease-out)] motion-safe:group-hover:-translate-y-[3%] motion-safe:group-hover:scale-[1.025]"
    : "";
  const webRadius = compact ? "rounded-[8px]" : "rounded-[12px]";
  const phoneRadius = compact ? "rounded-[10px]" : "rounded-[20px]";
  const alt = (kind: string) => `${project.name} ${kind}`;

  const phoneShots = phones.map((shot, i) => (
    <Fragment key={i}>
      {themed(shot, (src, themeClass) => (
        <Image
          key={src}
          src={src}
          alt={alt("mobile app")}
          width={0}
          height={0}
          unoptimized
          className={`h-full w-auto max-w-none shrink-0 ${phoneRadius} ${frame} ${lift} ${themeClass}`}
        />
      ))}
    </Fragment>
  ));

  return (
    <div
      data-project-stage
      className={`relative aspect-video overflow-hidden rounded-[var(--radius-card)] border border-line ${className}`}
      style={{
        background: `radial-gradient(80% 70% at 50% 110%, ${project.cover.glow}40, transparent 72%), linear-gradient(180deg, var(--surface), var(--surface-2))`,
      }}
    >
      <div className="absolute inset-[5%] flex items-center justify-center gap-[2.5%]">
        {web && (
          <div className="flex h-full min-w-0 flex-1 items-center justify-center">
            {themed(web, (src, themeClass) => (
              <Image
                key={src}
                src={src}
                alt={alt("web dashboard")}
                width={0}
                height={0}
                unoptimized
                className={`h-auto max-h-full w-auto max-w-full ${webRadius} ${frame} ${lift} ${themeClass}`}
              />
            ))}
          </div>
        )}
        {phoneShots}
      </div>
    </div>
  );
}
