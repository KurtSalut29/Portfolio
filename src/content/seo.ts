import { profile } from "./profile";

/**
 * How search engines and link previews describe the site.
 * SITE_URL is the live domain; set NEXT_PUBLIC_SITE_URL on the host if it differs.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kurtmichaelsalut.com").replace(/\/$/, "");

export const seo = {
  title: `${profile.fullName} — Software Developer`,
  description: `I'm ${profile.fullName}, a software developer in ${profile.location}. I build web and mobile apps end to end, from planning and design to development and deployment.`,
  keywords: [
    profile.fullName,
    "Kurt Salut",
    "Software Developer",
    "Web Developer",
    "Mobile App Developer",
    "Full-stack Developer",
    "Next.js",
    "Flutter",
    "Biliran",
    "Philippines",
  ],
};

/** Profile links that point somewhere real (placeholders like "https://github.com/" are left out). */
export const realProfiles = profile.socials
  .map((s) => s.href)
  .filter((href) => {
    try {
      const u = new URL(href);
      return u.protocol.startsWith("http") && u.pathname.replace(/\/+$/, "") !== "";
    } catch {
      return false;
    }
  });
