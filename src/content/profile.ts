/**
 * Everything about you lives here.
 * Edit these values and the whole site updates. No component changes needed.
 */

export const profile = {
  initials: "KMS",
  firstName: "Kurt Michael",
  lastName: "Salut",
  fullName: "Kurt Michael Salut",
  role: "Software Developer",
  headline: "Software developer turning ideas into practical, reliable software.",
  // Hero: "{lead} {accent}" — the accent word is set in italic serif.
  hero: {
    lead: "I turn ideas into working",
    accent: "software.",
    intro:
      "I build software that solves problems, simplifies tasks, and creates meaningful experiences. From planning and design to development and deployment, I focus on creating solutions that are practical, reliable, and built around people's needs. Every project is an opportunity to learn, solve problems, and turn ideas into something real.",
  },
  // Plain-text pitch used for SEO and the resume.
  pitch:
    "Software developer building web and mobile apps end to end, from the interface to the APIs and data behind it.",
  location: "Biliran, Philippines",
  email: "kurtsalut18@gmail.com",
  availability: {
    open: true,
    label: "Available for freelance and full-time work",
    short: "Open to work",
  },
  focus: ["Software development", "System design", "Problem solving"],
  now: {
    focus: "Full-stack web and mobile development",
    learning: "System design and cloud deployment",
  },
  about: [
    "I'm Kurt, a software developer from Biliran, Philippines. I build web and mobile apps from start to finish: I plan the features, design the screens, write the code, and put the finished product online.",
    "My projects include an inventory and delivery system for a hardware store, a disaster reporting app built with my team, and a mobile app that identifies rocks using a model I trained myself. What I enjoy most is seeing people use something I made and finding it makes their work easier.",
  ],
  // Short answers for the About section's fact sheet.
  facts: {
    basedIn: "Biliran, Philippines",
    builds: "Web apps, mobile apps, and the APIs behind them",
    learning: "System design and cloud deployment",
    openTo: "Freelance projects and full-time roles",
  },
  education: {
    school: "Biliran Province State University",
    degree: "BS Computer Science",
    start: "2023",
    end: "Present",
    year: "3rd year",
  },
  // Square crop of public/profile/Salut, Kurt Michael S..png, used wherever your avatar appears.
  portrait: "/profile/avatar-hd.webp" as string | null,
  resumeHref: "/resume",
  signature: "Keep building...",
  quote: {
    text: "Technology is not just about building systems. It is about creating opportunities for a better tomorrow.",
    author: "Kurt Michael Salut",
  },
  sidebarTagline: ["Better systems.", "A safer community."],
  socials: [
    { label: "GitHub", href: "https://github.com/KurtSalut29", icon: "github" },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
    { label: "X", href: "https://x.com/", icon: "x" },
    { label: "Email", href: "mailto:kurtsalut18@gmail.com", icon: "email" },
  ],
} as const;

export type SocialIcon = (typeof profile.socials)[number]["icon"];
