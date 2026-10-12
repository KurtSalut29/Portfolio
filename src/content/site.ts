/**
 * Section content: navigation, value props, services, skills, journey, activity.
 * Sample copy for review. Replace freely.
 */

export const nav = [
  // Groups follow the page order, so the active item always moves down the list as you scroll.
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "services", label: "Services", group: "What I offer" },
  { id: "skills", label: "Skills", group: "What I offer" },
  { id: "certificates", label: "Certificates", group: "Track record" },
  { id: "journey", label: "Journey", group: "Track record" },
  // A page of its own rather than a section; listed once it has photos (src/content/gallery.ts).
  { id: "gallery", label: "Gallery", group: "Track record", href: "/gallery" },
  { id: "contact", label: "Contact", group: "Get in touch" },
] as const;

export type NavId = (typeof nav)[number]["id"];

/** "What I bring" - the reasons to hire you, each backed by proof. */
export const values = [
  {
    title: "Clean code",
    body: "Readable, tested, and documented, so the next developer can pick it up without a walkthrough.",
    icon: "code",
  },
  {
    title: "Real-world impact",
    body: "I build for actual users in my province, not just for a demo.",
    icon: "globe",
  },
  {
    title: "Fast learner",
    body: "New stack? I ship a working prototype first, then go deep.",
    icon: "lightning",
  },
  {
    title: "Team player",
    body: "Comfortable leading a team or slotting into an existing one.",
    icon: "users",
  },
] as const;

export const services = [
  {
    title: "Web applications",
    body: "Dashboards, booking systems, and internal tools built with React and Next.js. Fast, responsive, and easy to maintain.",
    forWho: "Small businesses, schools, local organizations",
    icon: "browser",
  },
  {
    title: "Mobile apps",
    body: "Cross-platform Android and iOS apps from a single Flutter codebase, with offline support where it matters.",
    forWho: "Startups and community projects",
    icon: "phone",
  },
  {
    title: "Design to code",
    body: "Your Figma design turned into a pixel-accurate, accessible, animated interface.",
    forWho: "Designers and agencies",
    icon: "pen",
  },
  {
    title: "APIs and databases",
    body: "Backends with FastAPI and Supabase, clean data models, and authentication done right.",
    forWho: "Teams that need a solid backend",
    icon: "database",
  },
] as const;

export const workflow = [
  { title: "Understand", body: "We talk through the problem, the users, and what success looks like." },
  { title: "Design", body: "I sketch the flow and interface, and you approve before any code is written." },
  { title: "Build", body: "Weekly progress you can click through, not just status updates." },
  { title: "Launch", body: "Deployment, a handover guide, and support after go-live." },
] as const;

export const skillGroups = [
  {
    title: "Languages",
    icon: "code",
    items: [
      { name: "Java", slug: "openjdk" },
      { name: "Python", slug: "python" },
      { name: "JavaScript", slug: "javascript" },
      { name: "TypeScript", slug: "typescript" },
      { name: "Dart", slug: "dart" },
      { name: "PHP", slug: "php" },
      { name: "SQL", slug: "mysql" },
    ],
  },
  {
    title: "Frameworks",
    icon: "stack",
    items: [
      { name: "Flutter", slug: "flutter" },
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "FastAPI", slug: "fastapi" },
      { name: "Django", slug: "django" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
    ],
  },
  {
    title: "Data",
    icon: "database",
    items: [
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "Supabase", slug: "supabase" },
      { name: "PostGIS", slug: "postgis" },
    ],
  },
  {
    title: "Tools",
    icon: "wrench",
    items: [
      { name: "Git", slug: "git" },
      { name: "GitHub", slug: "github" },
      { name: "Figma", slug: "figma" },
      { name: "Docker", slug: "docker" },
      { name: "Linux", slug: "linux" },
    ],
  },
] as const;

export const interests = ["Web development", "Mobile development", "System design", "AI and NLP", "UI/UX"];

/** Milestones. Oldest first. */
export const journey = [
  {
    date: "2023",
    title: "First lines of code",
    body: "Started BS Computer Science at Biliran Province State University. Wrote my first Java program and got hooked.",
  },
  {
    date: "2024",
    title: "Going deeper",
    body: "Went deep on data structures, concurrency, and how parallel processing really works.",
  },
  {
    date: "2025",
    title: "Building for people",
    body: "Shipped TINGI with my team and learned how much user feedback changes a product.",
  },
  {
    date: "2025 to now",
    title: "Leading ZIREN",
    body: "Leading a team building a web and mobile system end to end, from UI design to AI-assisted features.",
  },
  {
    date: "Next",
    title: "What's next",
    body: "A full-time role or long-term client where I can ship production software that people rely on.",
    upcoming: true,
  },
] as const;

export const activity = [
  { title: "ZIREN", body: "UI/UX improvements", date: "Sep 28, 2025" },
  { title: "TINGI", body: "Added marketplace feature", date: "Sep 20, 2025" },
  { title: "Portfolio", body: "New design and content", date: "Sep 12, 2025" },
] as const;

export const inquiryTypes = ["Full-time role", "Freelance project", "Collaboration", "Just saying hi"] as const;
