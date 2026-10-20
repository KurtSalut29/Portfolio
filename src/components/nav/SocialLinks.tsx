import { profile } from "@/content/profile";
import { Icon } from "@/components/icons/Icon";

/** Social profiles as icon buttons, or with `labels`, as small icon-and-name links (the sidebar and the mobile sheet). */
export function SocialLinks({ className = "", labels = false }: { className?: string; labels?: boolean }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {profile.socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={labels ? undefined : s.label}
            className={`${
              labels ? "flex h-8 items-center gap-1 px-1 text-[12px]" : "grid size-9 place-items-center"
            } rounded-[var(--radius-control)] text-ink-3 transition-[color,background-color,transform] duration-200 hover:bg-surface hover:text-ink active:scale-95`}
          >
            <Icon name={s.icon} size={labels ? 14 : 18} />
            {labels && s.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
