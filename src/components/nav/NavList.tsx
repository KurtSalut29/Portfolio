"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { motion } from "motion/react";
import {
  Award,
  BriefcaseBusiness,
  FolderKanban,
  House,
  Images,
  Layers,
  Mail,
  Milestone,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { nav, skillGroups, type NavId } from "@/content/site";
import { projects } from "@/content/projects";
import { certificates } from "@/content/certificates";
import { profile } from "@/content/profile";
import { gallery } from "@/content/gallery";
import { useActiveSection } from "./useActiveSection";
import { SectionLink } from "./SectionLink";

export const ICONS: Record<NavId, LucideIcon> = {
  home: House,
  projects: FolderKanban,
  about: UserRound,
  services: BriefcaseBusiness,
  skills: Layers,
  certificates: Award,
  journey: Milestone,
  contact: Mail,
  gallery: Images,
};

/** How many things each collection holds, read from the content so it never goes stale. */
export const COUNTS: Partial<Record<NavId, number>> = {
  projects: projects.filter((p) => p.featured).length,
  skills: new Set(skillGroups.flatMap((g) => g.items.map((i) => i.name))).size,
  certificates: certificates.length,
  gallery: gallery.length,
};

export type Item = { id: NavId; label: string; group?: string; href?: string };

/** Consecutive items with the same group label render as one block. */
function grouped(items: readonly Item[]) {
  const blocks: { label?: string; items: Item[] }[] = [];
  for (const item of items) {
    const last = blocks.at(-1);
    if (last && last.label === item.group) last.items.push(item);
    else blocks.push({ label: item.group, items: [item] });
  }
  return blocks;
}

const blocks = grouped(nav.filter((n) => n.id !== "gallery" || gallery.length > 0));

/** Sections scroll within the home page; items with an href are pages of their own. */
export function NavLink({
  item,
  onNavigate,
  children,
  ...rest
}: { item: Item; onNavigate?: () => void; children: ReactNode } & Omit<ComponentPropsWithoutRef<"a">, "href">) {
  if (item.href) {
    return (
      <Link href={item.href} transitionTypes={["nav-forward"]} onClick={onNavigate} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <SectionLink to={item.id} onNavigate={onNavigate} {...rest}>
      {children}
    </SectionLink>
  );
}

/**
 * Shared by the desktop sidebar and the mobile drawer.
 * `layoutGroup` keeps the two active highlights from animating into each other.
 */
export function NavList({ layoutGroup, onNavigate }: { layoutGroup: string; onNavigate?: () => void }) {
  const active = useActiveSection();
  const onHome = usePathname() === "/";

  return (
    <nav aria-label="Main" className="flex flex-col gap-5 [@media(max-height:760px)]:gap-3">
      {blocks.map((block) => (
        <div key={block.items[0].id}>
          {block.label && (
            <p id={`${layoutGroup}-${block.items[0].id}-label`} className="px-3 pb-1.5 [@media(max-height:760px)]:pb-1 text-[11.5px] font-medium tracking-[0.01em] text-ink-3">
              {block.label}
            </p>
          )}
          <ul
            className="flex flex-col gap-0.5"
            aria-labelledby={block.label ? `${layoutGroup}-${block.items[0].id}-label` : undefined}
          >
            {block.items.map((item) => {
              const Icon = ICONS[item.id];
              const isActive = active === item.id;
              const count = COUNTS[item.id];
              const available = item.id === "contact" && profile.availability.open;
              return (
                <li key={item.id}>
                  <NavLink
                    item={item}
                    onNavigate={onNavigate}
                    aria-current={isActive ? (onHome ? "location" : "page") : undefined}
                    className={`group/nav relative flex h-10 [@media(max-height:760px)]:h-9 items-center gap-3 rounded-[11px] px-3 text-[14.5px] transition-colors duration-200 ${
                      isActive ? "font-medium text-ink" : "text-ink-2 hover:bg-[var(--nav-hover)] hover:text-ink"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`${layoutGroup}-active`}
                        aria-hidden="true"
                        className="nav-pill absolute inset-0 rounded-[11px]"
                        transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                      />
                    )}
                    <Icon
                      size={17}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className={`relative shrink-0 transition-colors duration-200 ${
                        isActive ? "text-accent" : "text-ink-3 group-hover/nav:text-ink-2"
                      }`}
                    />
                    <span className="relative">{item.label}</span>
                    {count !== undefined && (
                      <span className="relative ml-auto font-mono text-[11.5px] text-ink-3 tabular-nums">
                        <span className="sr-only">(</span>
                        {String(count).padStart(2, "0")}
                        <span className="sr-only"> items)</span>
                      </span>
                    )}
                    {available && (
                      <span className="relative ml-auto inline-flex h-[22px] items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--live)_14%,transparent)] px-2 text-[11px] font-medium text-[var(--live-ink)]">
                        <span className="status-dot !size-1.5" aria-hidden="true" />
                        {profile.availability.short}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
