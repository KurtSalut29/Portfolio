/**
 * Section content: navigation, value props, services, skills, journey.
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
  { id: "guestbook", label: "Guestbook", group: "Get in touch" },
  { id: "contact", label: "Contact", group: "Get in touch" },
] as const;

export type NavId = (typeof nav)[number]["id"];

/**
 * "What I bring" - the reasons to work with you. Each one points at proof:
 * projects where it shows (slugs from projects.ts) or a link to the code itself.
 */
export const values = [
  {
    title: "Code that's easy to hand over",
    body: "Clear names, small focused parts, and notes where they help, so the next developer can pick it up without a walkthrough.",
    icon: "code",
    proof: { label: "See my code on GitHub", href: "https://github.com/KurtSalut29" },
  },
  {
    title: "Built for real people",
    body: "I build for the people who will use it every day, like a store's staff tracking deliveries or residents reporting an emergency, not just for a demo.",
    icon: "globe",
    proof: { projects: ["rm-hardware", "ziren"] },
  },
  {
    title: "Quick to learn new tools",
    body: "PHP, Django, Flutter, Next.js, even training my own model. I learn what the project needs, get a working version out first, then improve it.",
    icon: "lightning",
    proof: { projects: ["rockalyzer", "ace-sched", "hms"] },
  },
  {
    title: "Can lead or support",
    body: "I have led a team of four as lead developer and built alongside a team of three. I keep updates clear, so no one is left guessing.",
    icon: "users",
    proof: { projects: ["ziren", "tingi"] },
  },
] as const;

export const services = [
  {
    title: "Web apps and systems",
    body: "Websites and web systems that run your day-to-day work, built with React and Next.js.",
    points: ["Admin dashboards and reports", "Inventory, sales, and booking tools", "User accounts with roles", "Works on phones and desktops"],
    examples: ["rm-hardware", "hms", "ace-sched"],
    icon: "browser",
  },
  {
    title: "Mobile apps",
    body: "Apps for Android and iOS from a single Flutter codebase, so both platforms get the same features.",
    points: ["Camera, maps, and GPS features", "Smart features like image recognition", "Offline support where it matters", "Ready for app store release"],
    examples: ["ziren", "rockalyzer", "tingi"],
    icon: "phone",
  },
  {
    title: "Backends and databases",
    body: "The server side that stores your data safely and keeps your app and website in sync.",
    points: ["REST APIs with FastAPI or Django", "Databases with PostgreSQL and Supabase", "Secure sign-in and permissions", "Clean data you can export"],
    examples: ["ziren", "ascrem"],
    icon: "database",
  },
  {
    title: "Design to code",
    body: "Your Figma design or rough sketch turned into a clean, responsive interface that is easy to use.",
    points: ["Pixel-accurate layouts", "Works on every screen size", "Smooth, purposeful animation", "Accessible to every visitor"],
    examples: ["family-feud", "uncle-brew-pos"],
    icon: "pen",
  },
] as const;

export const workflow = [
  { title: "Talk", body: "We go over the problem, who will use the software, and what it needs to do." },
  { title: "Plan and design", body: "I map out the features and screens. You approve them before any code is written." },
  { title: "Build", body: "I share progress every week, so you can try the app as it grows and give feedback early." },
  { title: "Launch and support", body: "I put it online, show you how to use it, and fix any issues that come up after launch." },
] as const;

export const skillGroups = [
  {
    title: "Languages",
    blurb: "What I write code in.",
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
    blurb: "What I build apps and websites with.",
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
    blurb: "Where the data lives.",
    icon: "database",
    items: [
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "Supabase", slug: "supabase" },
      { name: "PostGIS", slug: "postgis" },
    ],
  },
  {
    title: "Tools",
    blurb: "What I use every day to design, ship, and collaborate.",
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

export const inquiryTypes = ["Full-time role", "Freelance project", "Collaboration", "Just saying hi"] as const;
