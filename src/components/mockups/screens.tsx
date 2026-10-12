import Image from "next/image";
import {
  BatteryFull,
  Camera,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  FileText,
  Flame,
  HeartPulse,
  Lock,
  MapPin,
  Mountain,
  RotateCw,
  Search,
  Settings,
  Signal,
  Siren,
  Sparkles,
  UsersRound,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { Project, Shot } from "@/content/projects";
import { ProjectGlyph } from "@/components/icons/ProjectGlyph";

/*
 * What shows on each device's screen.
 * A real screenshot (project.screens) always wins. Until then, each project gets a
 * placeholder screen built from its own features, with fictional sample data and no
 * invented results. Sizes are in cqw of the device, like the frames.
 */

/** Icon sized in cqw (lucide's size prop only takes px). */
const ic = (v: number) => ({ width: `${v}cqw`, height: `${v}cqw` });
const SANS = "font-[family-name:var(--font-geist-sans)]";
const INK = "#0d1117";
const MUTED = "#5b6472";

/* ---------------------------------------------------------------- shared */

function PhoneStatusBar() {
  return (
    <div className="flex items-center justify-between px-[7.5cqw] pt-[3.2cqw] text-[3.3cqw] font-semibold" style={{ color: INK }}>
      <span>9:41</span>
      <span className="flex items-center gap-[1.2cqw]">
        <Signal style={ic(3.4)} strokeWidth={2.5} />
        <Wifi style={ic(3.4)} strokeWidth={2.5} />
        <BatteryFull style={ic(4.4)} strokeWidth={2} />
      </span>
    </div>
  );
}

function BrowserChrome({ title, path, glow, icon }: { title: string; path: string; glow: string; icon: Project["icon"] }) {
  return (
    <div className="shrink-0 bg-[#e9ebef]">
      <div className="flex h-[2.9cqw] items-end gap-[0.8cqw] px-[1.2cqw]">
        <span className="mr-[0.6cqw] mb-[0.95cqw] flex gap-[0.55cqw]">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="size-[0.85cqw] rounded-full" style={{ background: c }} />
          ))}
        </span>
        <span className="flex h-[2.2cqw] w-[20cqw] items-center gap-[0.6cqw] rounded-t-[0.7cqw] bg-white px-[0.9cqw] text-[0.95cqw]" style={{ color: INK }}>
          <span className="grid size-[1.3cqw] shrink-0 place-items-center rounded-[0.3cqw]" style={{ background: glow }}>
            <ProjectGlyph icon={icon} size="70%" color="#fff" />
          </span>
          <span className="truncate">{title}</span>
        </span>
      </div>
      <div className="flex h-[2.8cqw] items-center gap-[1cqw] bg-white px-[1.2cqw] text-[#80868f]">
        <ChevronLeft style={ic(1.3)} />
        <ChevronRight style={ic(1.3)} />
        <RotateCw style={ic(1.1)} />
        <span className="flex h-[1.9cqw] flex-1 items-center gap-[0.6cqw] rounded-full bg-[#f1f3f5] px-[1cqw] text-[0.95cqw]">
          <Lock style={ic(0.9)} />
          {path}
        </span>
      </div>
    </div>
  );
}

/** Stand-in for a photo attached to a report. */
function PhotoTile({ className = "", tone = 0 }: { className?: string; tone?: number }) {
  const tones = [
    "linear-gradient(160deg,#9fb3c4 0%,#5e7487 55%,#3c4b59 100%)",
    "linear-gradient(160deg,#b7a98f 0%,#7d6f58 55%,#4c4436 100%)",
  ];
  return <span className={`block ${className}`} style={{ background: tones[tone % tones.length] }} />;
}

/* ---------------------------------------------------------------- ZIREN */

const CATEGORIES: [string, LucideIcon][] = [
  ["Flood", Waves],
  ["Fire", Flame],
  ["Landslide", Mountain],
  ["Medical", HeartPulse],
  ["Accident", CarFront],
  ["Other", Ellipsis],
];

function ZirenMobile({ project }: { project: Project }) {
  const { glow } = project.cover;
  return (
    <div className={`flex h-full flex-col bg-[#f6f7f9] ${SANS}`} style={{ color: INK }}>
      <PhoneStatusBar />
      <div className="px-[6cqw] pt-[6cqw]">
        <p className="text-[3.1cqw] font-semibold tracking-wide" style={{ color: glow }}>
          ZIREN
        </p>
        <p className="mt-[0.8cqw] text-[6.4cqw] leading-[1.1] font-semibold tracking-[-0.02em]">Report an incident</p>
        <p className="mt-[1.4cqw] text-[3.2cqw]" style={{ color: MUTED }}>
          Help responders reach you faster.
        </p>
      </div>

      <p className="px-[6cqw] pt-[5cqw] text-[2.8cqw] font-semibold tracking-wider uppercase" style={{ color: MUTED }}>
        What happened?
      </p>
      <div className="grid grid-cols-3 gap-[2cqw] px-[6cqw] pt-[2.2cqw]">
        {CATEGORIES.map(([label, I], i) => (
          <div
            key={label}
            className="flex flex-col items-center gap-[1.2cqw] rounded-[3cqw] border py-[2.6cqw] text-[2.8cqw] font-medium"
            style={i === 0 ? { background: glow, borderColor: glow, color: "#fff" } : { background: "#fff", borderColor: "#e3e6eb" }}
          >
            <I style={ic(4.6)} strokeWidth={1.8} />
            {label}
          </div>
        ))}
      </div>

      <div className="mx-[6cqw] mt-[3.6cqw] flex items-center gap-[2.6cqw] rounded-[3.4cqw] border border-[#e3e6eb] bg-white p-[2.8cqw]">
        <span className="grid size-[8cqw] place-items-center rounded-[2.4cqw]" style={{ background: `${glow}1f`, color: glow }}>
          <MapPin style={ic(4.4)} strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[3.3cqw] font-semibold">Naval, Biliran</span>
          <span className="block text-[2.7cqw]" style={{ color: MUTED }}>
            Using your GPS location
          </span>
        </span>
        <span className="text-[2.8cqw] font-semibold" style={{ color: glow }}>
          Edit
        </span>
      </div>

      <div className="mx-[6cqw] mt-[2.8cqw] flex gap-[2cqw]">
        <PhotoTile className="size-[14cqw] rounded-[3cqw]" />
        <PhotoTile className="size-[14cqw] rounded-[3cqw]" tone={1} />
        <span className="grid size-[14cqw] place-items-center rounded-[3cqw] border-[0.4cqw] border-dashed border-[#c9ced6] text-[#80868f]">
          <Camera style={ic(5)} strokeWidth={1.8} />
        </span>
      </div>

      <div className="mx-[6cqw] mt-[2.8cqw] rounded-[3.4cqw] border border-[#e3e6eb] bg-white p-[2.8cqw] text-[2.9cqw] leading-[1.45]" style={{ color: MUTED }}>
        Water is rising fast near the bridge. Two families need help getting out.
      </div>

      <div className="mt-auto px-[6cqw] pb-[2.6cqw]">
        <span className="grid h-[11cqw] place-items-center rounded-[3.4cqw] text-[3.7cqw] font-semibold text-white" style={{ background: glow }}>
          Send report
        </span>
      </div>
      <span className="mx-auto mb-[2cqw] block h-[1.2cqw] w-[32cqw] rounded-full bg-[#0d1117]" />
    </div>
  );
}

const SEVERITY = {
  High: { bg: "#fde8e8", fg: "#c8333a" },
  Medium: { bg: "#fdf1dc", fg: "#a86a06" },
  Low: { bg: "#e3f4ea", fg: "#23804f" },
} as const;

const REPORTS: { type: string; icon: LucideIcon; place: string; ago: string; severity: keyof typeof SEVERITY }[] = [
  { type: "Flood", icon: Waves, place: "Naval", ago: "2 min", severity: "High" },
  { type: "Landslide", icon: Mountain, place: "Caibiran", ago: "6 min", severity: "High" },
  { type: "Medical", icon: HeartPulse, place: "Kawayan", ago: "11 min", severity: "Medium" },
  { type: "Accident", icon: CarFront, place: "Almeria", ago: "18 min", severity: "Low" },
];

function ZirenWeb({ project }: { project: Project }) {
  const { base, glow } = project.cover;
  return (
    <div className={`flex h-full flex-col bg-white ${SANS}`} style={{ color: INK }}>
      <BrowserChrome title="ZIREN — Responders" path="ziren / dashboard" glow={glow} icon={project.icon} />
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[12.5cqw] shrink-0 flex-col gap-[0.5cqw] p-[1.2cqw] text-[1cqw] text-white/70" style={{ background: base }}>
          <span className="mb-[1cqw] flex items-center gap-[0.7cqw] text-[1.25cqw] font-semibold text-white">
            <span className="grid size-[2cqw] place-items-center rounded-[0.5cqw]" style={{ background: glow }}>
              <ProjectGlyph icon={project.icon} size="68%" color="#fff" />
            </span>
            ZIREN
          </span>
          {(
            [
              ["Incidents", Siren],
              ["Teams", UsersRound],
              ["Reports", FileText],
              ["Settings", Settings],
            ] as [string, LucideIcon][]
          ).map(([label, I], i) => (
            <span
              key={label}
              className={`flex items-center gap-[0.7cqw] rounded-[0.5cqw] px-[0.7cqw] py-[0.55cqw] ${i === 0 ? "bg-white/10 text-white" : ""}`}
            >
              <I style={ic(1.15)} strokeWidth={1.9} />
              {label}
            </span>
          ))}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col bg-[#f6f7f9] p-[1.5cqw]">
          <div className="flex items-center gap-[1cqw]">
            <span className="text-[1.6cqw] font-semibold tracking-[-0.01em]">Incoming reports</span>
            <span className="flex items-center gap-[0.4cqw] rounded-full bg-[#e3f4ea] px-[0.7cqw] py-[0.2cqw] text-[0.85cqw] font-medium text-[#23804f]">
              <span className="size-[0.55cqw] rounded-full bg-[#30a46c]" />
              Live
            </span>
            <span className="ml-auto flex h-[2cqw] w-[13cqw] items-center gap-[0.5cqw] rounded-[0.6cqw] border border-[#e3e6eb] bg-white px-[0.8cqw] text-[0.9cqw] text-[#80868f]">
              <Search style={ic(1)} />
              Search reports
            </span>
          </div>

          <div className="mt-[1.2cqw] grid min-h-0 flex-1 grid-cols-[1.05fr_1fr] gap-[1.1cqw]">
            <div className="space-y-[0.7cqw]">
              {REPORTS.map((r, i) => {
                const s = SEVERITY[r.severity];
                return (
                  <div
                    key={r.type}
                    className="flex items-center gap-[0.9cqw] rounded-[0.8cqw] border bg-white p-[0.9cqw]"
                    style={{ borderColor: i === 0 ? glow : "#e3e6eb", boxShadow: i === 0 ? `0 0 0 0.15cqw ${glow}33` : undefined }}
                  >
                    <span className="grid size-[2.5cqw] shrink-0 place-items-center rounded-[0.6cqw]" style={{ background: s.bg, color: s.fg }}>
                      <r.icon style={ic(1.3)} strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[1.1cqw] font-semibold">{r.type}</span>
                      <span className="block text-[0.9cqw]" style={{ color: MUTED }}>
                        {r.place}, Biliran · {r.ago} ago
                      </span>
                    </span>
                    <span className="rounded-full px-[0.7cqw] py-[0.2cqw] text-[0.85cqw] font-semibold" style={{ background: s.bg, color: s.fg }}>
                      {r.severity}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex min-h-0 flex-col rounded-[0.8cqw] border border-[#e3e6eb] bg-white p-[1.2cqw]">
              <span className="text-[1.35cqw] font-semibold">Flood report</span>
              <span className="text-[0.9cqw]" style={{ color: MUTED }}>
                Naval, Biliran · 2 min ago
              </span>
              <div className="mt-[0.9cqw] grid grid-cols-2 gap-[0.6cqw]">
                <PhotoTile className="h-[5.2cqw] rounded-[0.6cqw]" />
                <PhotoTile className="h-[5.2cqw] rounded-[0.6cqw]" tone={1} />
              </div>
              <p className="mt-[0.9cqw] text-[0.95cqw] leading-[1.45]" style={{ color: MUTED }}>
                Water is rising fast near the bridge. Two families need help getting out.
              </p>
              <div className="mt-[0.9cqw] rounded-[0.7cqw] p-[0.9cqw]" style={{ background: `${glow}12` }}>
                <span className="flex items-center gap-[0.5cqw] text-[0.85cqw] font-medium" style={{ color: glow }}>
                  <Sparkles style={ic(1)} strokeWidth={2} />
                  AI suggestion
                </span>
                <span className="mt-[0.3cqw] block text-[1.1cqw] font-semibold">Flood · High severity</span>
              </div>
              <div className="mt-auto flex gap-[0.6cqw] pt-[0.9cqw]">
                <span className="grid h-[2.4cqw] flex-1 place-items-center rounded-[0.6cqw] text-[1cqw] font-semibold text-white" style={{ background: glow }}>
                  Assign team
                </span>
                <span className="grid h-[2.4cqw] place-items-center rounded-[0.6cqw] border border-[#e3e6eb] px-[1.2cqw] text-[1cqw] font-medium">
                  Edit
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- lookup */

/** A clean branded splash for projects without a custom placeholder yet. */
function Splash({ project }: { project: Project }) {
  const { base, glow } = project.cover;
  return (
    <div className={`grid h-full place-items-center ${SANS}`} style={{ background: base }}>
      <span className="grid place-items-center gap-[3cqw] text-white">
        <span className="grid size-[16cqw] place-items-center rounded-[4cqw]" style={{ background: glow }}>
          <ProjectGlyph icon={project.icon} size="62%" color="#fff" />
        </span>
        <span className="text-[5cqw] font-semibold">{project.name}</span>
      </span>
    </div>
  );
}

const PLACEHOLDERS: Record<string, { mobile?: typeof ZirenMobile; web?: typeof ZirenWeb }> = {
  ziren: { mobile: ZirenMobile, web: ZirenWeb },
};

export function Screen({ project, kind }: { project: Project; kind: "mobile" | "web" }) {
  const shot = project.screens?.[kind];
  if (shot) {
    const alt = `${project.name} ${kind === "mobile" ? "mobile app" : "web dashboard"}`;
    // Screenshots are served as the original files: re-encoding blurs small UI text.
    // Wide dashboards keep their sidebar in view; phones keep the top of the screen.
    const props = { position: kind === "mobile" ? "object-top" : "object-left-top" };
    // Centered layouts: the whole screenshot, letterboxed over a blurred, enlarged copy of itself.
    if (kind === "web" && project.webFit === "whole") {
      const src = typeof shot === "string" ? shot : shot.light;
      return (
        <>
          <Image src={src} alt="" fill unoptimized aria-hidden="true" className="scale-110 object-cover blur-xl brightness-75" />
          <Image src={src} alt={alt} fill unoptimized className="object-contain" />
        </>
      );
    }
    if (typeof shot === "string") {
      return <Image src={shot} alt={alt} fill unoptimized className={`object-cover ${props.position}`} />;
    }
    // Both themes render; CSS shows the one that matches, so switching themes never waits on a download.
    return (
      <>
        <Image src={shot.light} alt={alt} fill unoptimized className={`object-cover ${props.position} dark:hidden`} />
        <Image src={shot.dark} alt={alt} fill unoptimized className={`hidden object-cover ${props.position} dark:block`} />
      </>
    );
  }
  const Placeholder = PLACEHOLDERS[project.slug]?.[kind] ?? Splash;
  return <Placeholder project={project} />;
}

/**
 * A screenshot at its natural aspect ratio, full width of its container.
 * Light and dark pairs both render; CSS shows the one matching the site theme.
 */
export function ThemedImage({ shot, alt, className = "" }: { shot: Shot; alt: string; className?: string }) {
  const img = (src: string, extra = "") => (
    <Image src={src} alt={alt} width={0} height={0} unoptimized className={`h-auto w-full ${extra} ${className}`} />
  );
  if (typeof shot === "string") return img(shot);
  return (
    <>
      {img(shot.light, "dark:hidden")}
      {img(shot.dark, "hidden dark:block")}
    </>
  );
}
