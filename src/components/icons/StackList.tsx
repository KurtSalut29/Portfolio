import { BrainCircuit, Code, Database, PenTool, type LucideIcon } from "lucide-react";
import { lookup } from "./TechIcon";

/**
 * What draws each stack item: a Simple Icons slug for real products (shown in their brand color),
 * or a Lucide icon for concepts that have no logo of their own.
 */
const TECH: Record<string, string | LucideIcon> = {
  Flutter: "flutter",
  FastAPI: "fastapi",
  Django: "django",
  Supabase: "supabase",
  React: "react",
  "Next.js": "nextdotjs",
  Java: "openjdk",
  Python: "python",
  PHP: "php",
  Leaflet: "leaflet",
  NLP: BrainCircuit,
  "Machine learning": BrainCircuit,
  AsyncStorage: Database,
  "UI/UX": PenTool,
};

/** Brand colors this close to black or white vanish on one of the themes; those follow the text color instead. */
function readable(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.12 && lum < 0.92;
}

function Logo({ name, size }: { name: string; size: number }) {
  const entry = TECH[name];
  if (typeof entry === "string") {
    const icon = lookup(entry);
    if (icon) {
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="shrink-0">
          <path d={icon.path} fill={readable(icon.hex) ? `#${icon.hex}` : "currentColor"} />
        </svg>
      );
    }
  }
  const I = !entry || typeof entry === "string" ? Code : entry;
  return <I size={size} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-ink-3" />;
}

/** A project's tech stack as logo chips. */
export function StackList({ stack, className = "" }: { stack: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Tech stack">
      {stack.map((t) => (
        <li
          key={t}
          className="inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface pr-3 pl-2.5 text-[13px] text-ink-2"
        >
          <Logo name={t} size={15} />
          {t}
        </li>
      ))}
    </ul>
  );
}
