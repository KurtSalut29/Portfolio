import { profile } from "@/content/profile";
import { Icon } from "@/components/icons/Icon";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {profile.socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={s.label}
            className="grid size-9 place-items-center rounded-[var(--radius-control)] text-ink-3 transition-[color,background-color,transform] duration-200 hover:bg-surface hover:text-ink active:scale-95"
          >
            <Icon name={s.icon} size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}
