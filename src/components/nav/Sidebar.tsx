import Link from "next/link";
import { profile } from "@/content/profile";
import { Avatar } from "./Avatar";
import { NavList } from "./NavList";
import { NavActions } from "./NavActions";
import { SocialLinks } from "./SocialLinks";

/**
 * Fixed desktop sidebar (lg and up): a card floating off the page edge.
 * Identity on top, navigation in the middle, actions at the base. Mobile uses <MobileNav />.
 */
export function Sidebar() {
  return (
    <aside
      aria-label="Sidebar"
      className="no-print fixed inset-y-3 left-3 z-40 hidden w-[calc(var(--sidebar-w)-12px)] flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--card-shadow)] lg:flex"
    >
      {/* Identity: always visible */}
        <div className="shrink-0 p-5 [@media(max-height:760px)]:p-4">
          <Link href="/" aria-label={`${profile.fullName}, home`} className="group flex items-center gap-3 rounded-[var(--radius-control)]">
            <Avatar size={42} />
            <span className="min-w-0">
              <span className="block font-display text-[16px] leading-tight font-semibold tracking-[-0.02em] text-ink">
                {profile.fullName}
              </span>
              <span className="mt-0.5 block text-[12.5px] text-ink-3">{profile.role}</span>
            </span>
          </Link>
        </div>

        {/* Navigation: scrolls on its own when the window is too short for every link
            (smooth scrolling hands it the wheel then; see Providers). */}
        <div
          className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-line px-3 py-5 [@media(max-height:760px)]:py-4"
        >
          <NavList layoutGroup="sidebar" />
        </div>

        {/* Base: always visible */}
        <div className="shrink-0 border-t border-line p-4 [@media(max-height:760px)]:p-3">
          <NavActions />
          <SocialLinks className="-mx-1 mt-3 justify-between" />
        </div>
    </aside>
  );
}
