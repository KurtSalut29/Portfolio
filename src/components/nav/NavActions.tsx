import Link from "next/link";
import { ArrowUpRightIcon, FileTextIcon } from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "@/components/sound/SoundToggle";

/** Resume, sounds, and theme, side by side. Shared by the sidebar and the mobile drawer. */
export function NavActions({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex gap-2">
      <Link
        href={profile.resumeHref}
        transitionTypes={["nav-forward"]}
        onClick={onNavigate}
        className="group flex h-10 flex-1 items-center gap-2.5 rounded-[var(--radius-control)] border border-line bg-surface-2 px-3 text-sm text-ink-2 transition-[color,border-color,transform] duration-200 hover:border-line-strong hover:text-ink active:scale-[0.98]"
      >
        <FileTextIcon size={16} aria-hidden="true" />
        <span className="flex-1">Resume</span>
        <ArrowUpRightIcon
          size={13}
          aria-hidden="true"
          className="text-ink-3 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
      <SoundToggle />
      <ThemeToggle />
    </div>
  );
}
