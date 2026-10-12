/**
 * Projects double as case studies at /projects/[slug].
 * Sample copy for review. Replace with your real details.
 * The projects added from screenshots (HMS to Family Feud) describe only what the screenshots show;
 * year, status, role, team, timeline, stack, outcomes, and lessons are left out until confirmed.
 */

export type ProjectIcon =
  | "siren"
  | "recycle"
  | "funnel"
  | "plus"
  | "hospital"
  | "gem"
  | "hammer"
  | "coffee"
  | "calendar"
  | "clipboard"
  | "game";

/** A screenshot path, or a pair that follows the site's light and dark theme. */
export type Shot = string | { light: string; dark: string };

/** Decides the device mockup: a phone, a laptop, both, or a laptop running a terminal. */
export type Platform = "mobile" | "web" | "both" | "desktop";

export type Project = {
  slug: string;
  name: string;
  /** Two or three words, shown after the name on the project card: "ZIREN — Emergency Response". */
  short: string;
  tagline: string;
  /** Pill tags on the project card. The first one is highlighted, so lead with the strongest. */
  badges: string[];
  summary: string;
  /** Optional details: anything left out is simply not shown, so nothing is guessed on the live site. */
  year?: string;
  status?: "Shipped" | "In progress" | "Prototype";
  role?: string;
  team?: string;
  timeline?: string;
  /** Can be empty until the stack is confirmed; the Stack row hides itself. */
  stack: string[];
  icon: ProjectIcon;
  platform: Platform;
  /**
   * Real screenshots for the device mockups. Until these are set, the mockups show a branded placeholder UI.
   * mobile: a portrait phone screenshot (about 9:20). web: a desktop screenshot, cropped from the top left to 16:10.
   */
  screens?: { mobile?: Shot; web?: Shot };
  /**
   * How the web screenshot sits on the laptop screen. "crop" (default) fills it from the top left, which keeps a
   * dashboard's sidebar in view. "whole" shows the full screenshot over a blurred copy of itself, for centered
   * layouts like a game screen.
   */
  webFit?: "crop" | "whole";
  /** Optional real screenshot, e.g. "/images/projects/ziren.jpg". Replaces the generated cover art. */
  image?: string;
  /**
   * Every screenshot for the project page's Screens section, in order, each with a caption.
   * When set, it replaces the default list built from `screens`.
   */
  gallery?: { src: string; caption: string; kind: "web" | "mobile" }[];
  /** Brand colors: the cover background and the icon tile. */
  cover: { base: string; glow: string };
  featured?: boolean;
  links?: { live?: string; repo?: string };
  problem: string;
  solution: string;
  features: { title: string; body: string }[];
  /** Results and reflections: only you can write these, so they stay optional. */
  outcomes?: string[];
  lessons?: string;
};

export const projects: Project[] = [
  {
    slug: "ziren",
    name: "ZIREN",
    short: "Emergency Response",
    badges: ["Lead developer", "AI triage", "Made in Biliran"],
    tagline: "Emergency incident reporting and response coordination",
    summary:
      "A mobile and web system for disaster reporting in Biliran Province, with AI-assisted incident classification and severity suggestions.",
    year: "2025",
    status: "In progress",
    role: "Lead developer, UI/UX",
    team: "Team of 4",
    timeline: "2025 to present",
    stack: ["Flutter", "Next.js", "FastAPI", "Supabase", "NLP"],
    icon: "siren",
    platform: "both",
    screens: {
      web: { light: "/projects/ziren/web-light.png", dark: "/projects/ziren/web-dark.png" },
      mobile: { light: "/projects/ziren/mobile-light.jpg", dark: "/projects/ziren/mobile-dark.jpg" },
    },
    cover: { base: "#0f1a2b", glow: "#f26b1d" },
    featured: true,
    problem:
      "During typhoons and floods, incident reports in the province arrive through scattered calls and social media posts. Responders lose time sorting duplicates and guessing which reports are most urgent.",
    solution:
      "ZIREN gives residents a simple app to report incidents with location and photos, and gives responders a live web dashboard. An NLP model reads each report and suggests a category and severity, so the team can triage faster.",
    features: [
      {
        title: "One-tap reporting",
        body: "Residents send a report with GPS location, photos, and a short description, even on slow connections.",
      },
      {
        title: "AI triage",
        body: "An NLP classifier suggests incident type and severity. Responders confirm or correct it, keeping a human in the loop.",
      },
      {
        title: "Live response map",
        body: "Responders see every active incident on one map and can assign teams and update status in real time.",
      },
    ],
    outcomes: [
      "Designed around real workflows from local responders",
      "Severity suggestions shorten the time from report to triage",
      "Built to scale from barangay to province level",
    ],
    lessons:
      "Designing for emergencies taught me to cut every step that is not essential. The best feature is often the one you remove.",
  },
  {
    slug: "hms",
    name: "HMS",
    short: "Hospital Management",
    badges: ["My first system", "Healthcare", "Pharmacy and inventory"],
    tagline: "Patients, appointments, billing, and beds in one place",
    summary:
      "A web system for running a hospital: patient records, appointments, medical records, billing, pharmacy stock, and room occupancy, all from one dashboard.",
    year: "2023",
    stack: ["PHP"],
    icon: "hospital",
    platform: "web",
    screens: { web: "/projects/hms/web-dashboard.webp" },
    gallery: [
      { src: "/projects/hms/web-dashboard.webp", caption: "Dashboard: patients, appointments, beds, and collections", kind: "web" },
      { src: "/projects/hms/web-patients.webp", caption: "Patient records with blood type, physician, room, and status", kind: "web" },
      { src: "/projects/hms/web-appointments.webp", caption: "Appointments by doctor, date, and status", kind: "web" },
    ],
    cover: { base: "#0d1b33", glow: "#4f8bff" },
    featured: true,
    problem:
      "A hospital front desk juggles patient files, doctor schedules, billing, and bed assignments. Kept on paper or in separate spreadsheets, the same patient is looked up again and again, and no one can see at a glance how full the hospital is.",
    solution:
      "HMS puts that whole workflow behind one login. The dashboard shows registered patients, today's appointments, available beds, and money collected, and every module works from the same patient data.",
    features: [
      {
        title: "Dashboard at a glance",
        body: "Key numbers, a 12-month chart of outpatient and admitted visits, and bed occupancy by ward.",
      },
      {
        title: "Patient records",
        body: "Each patient's contact details, blood type, attending physician, room, and admission status, with search and filters.",
      },
      {
        title: "Appointments",
        body: "Bookings by doctor, department, date, and time, marked as scheduled or pending.",
      },
      {
        title: "Pharmacy and facility",
        body: "Medicine, supply categories, billing, and rooms, each managed in its own module.",
      },
    ],
  },
  {
    slug: "rockalyzer",
    name: "Rockalyzer",
    short: "Rock Identifier",
    badges: ["My first app", "Custom-trained model", "Geology"],
    tagline: "Scan a rock, learn what it is",
    summary:
      "A mobile app that identifies a rock from a photo using a machine learning model I trained on rock images, then shows its type, a confidence score, and saves finds to a personal collection.",
    year: "2024",
    stack: ["Flutter", "Machine learning"],
    icon: "gem",
    platform: "mobile",
    screens: { mobile: "/projects/rockalyzer/mobile-home.webp" },
    gallery: [
      { src: "/projects/rockalyzer/mobile-home.webp", caption: "Home: scan, upload, discoveries, and a how-it-works guide", kind: "mobile" },
      { src: "/projects/rockalyzer/mobile-scan.webp", caption: "Scan result with rock type and confidence score", kind: "mobile" },
    ],
    cover: { base: "#0f1a24", glow: "#3fe0c5" },
    featured: true,
    problem:
      "Identifying a rock usually takes a field guide and some experience. The students and hikers who find an interesting rock rarely have either with them.",
    solution:
      "I trained an image classification model on photos of different rocks and built the app around it. Rockalyzer sends a photo through the model and returns the rock's name, its type, and a confidence score, with a short description. Users can re-analyze, take a new photo, or save the result.",
    features: [
      {
        title: "Scan or upload",
        body: "Point the camera at a rock or pick a photo from the gallery.",
      },
      {
        title: "Custom-trained model",
        body: "A classifier I trained on rock images returns the rock's name, its type such as metamorphic, and how confident it is.",
      },
      {
        title: "Rock details",
        body: "A short description of how the rock forms and what makes it distinct.",
      },
      {
        title: "Discoveries",
        body: "Saved finds build a personal collection to look back on.",
      },
    ],
  },
  {
    slug: "rm-hardware",
    name: "RM Hardware",
    short: "Inventory and Delivery",
    badges: ["Client project", "Live delivery map", "Point of sale"],
    tagline: "Inventory, sales, and live delivery tracking for a hardware store",
    summary:
      "A web system I built for a client's hardware store in Biliran: inventory and restocks, point of sale, orders, and a live map of deliveries, with separate dashboards for admins and staff.",
    year: "2026",
    stack: ["Next.js", "Leaflet"],
    icon: "hammer",
    platform: "web",
    screens: { web: "/projects/rm-hardware/web-staff.webp" },
    gallery: [
      { src: "/projects/rm-hardware/web-staff.webp", caption: "Staff dashboard with live deliveries on the map", kind: "web" },
      { src: "/projects/rm-hardware/web-admin.webp", caption: "Admin dashboard with sales overview and low-stock alerts", kind: "web" },
    ],
    cover: { base: "#0f1830", glow: "#2f6bff" },
    featured: true,
    problem:
      "A hardware store has to know what is in stock, what sold today, and where each delivery is. Done by hand, low stock is noticed too late and customers have to call to ask where their order is.",
    solution:
      "RM Hardware brings stock, sales, and deliveries into one system. Staff ring up sales and dispatch orders, and everyone can follow each delivery on a live map.",
    features: [
      {
        title: "Live delivery map",
        body: "Orders and driver locations on an OpenStreetMap map, with a count of deliveries currently out.",
      },
      {
        title: "Point of sale",
        body: "Staff process transactions at the counter, and every sale is logged.",
      },
      {
        title: "Inventory and restocks",
        body: "Products, categories, and restocks, with alerts when an item runs low or out.",
      },
      {
        title: "Role-based dashboards",
        body: "Admins see revenue and a six-month sales chart; staff see today's sales and orders that still need a driver.",
      },
    ],
  },
  {
    slug: "uncle-brew-pos",
    name: "Uncle Brew POS",
    short: "Café Point of Sale",
    badges: ["Concept project", "Point of sale", "Inventory"],
    tagline: "A point of sale built for a coffee shop",
    summary:
      "A point of sale system designed for Uncle Brew Prime, a fictional coffee and dessert shop: a menu by category, dine-in, takeout, and delivery orders, live stock counts, order history, and sales reports.",
    year: "2026",
    stack: ["Next.js"],
    icon: "coffee",
    platform: "web",
    screens: { web: "/projects/uncle-brew-pos/web-pos.webp" },
    gallery: [
      { src: "/projects/uncle-brew-pos/web-pos.webp", caption: "Ordering screen with the current order and totals", kind: "web" },
    ],
    cover: { base: "#1f150e", glow: "#c08552" },
    featured: true,
    problem:
      "A busy café needs to take orders quickly, keep track of how much of each item is left, and know at the end of the day what sold.",
    solution:
      "The POS is built around the counter. Cashiers find items by category or search, pick a size, choose dine in, takeout, or delivery, and charge with tax worked out for them.",
    features: [
      {
        title: "Fast ordering",
        body: "Menu items grouped by category, with search and one-tap add to order.",
      },
      {
        title: "Order types",
        body: "Dine in, takeout, or delivery, with subtotal, tax, and total calculated automatically.",
      },
      {
        title: "Stock on every item",
        body: "Each menu card shows how many are left, so the counter knows before an item runs out.",
      },
      {
        title: "History and insights",
        body: "Order history, product management, sales reports, and customer feedback in one place.",
      },
    ],
  },
  {
    slug: "ace-sched",
    name: "A.C.E Sched",
    short: "Class Scheduling",
    badges: ["Personal project", "Scheduling", "Admin dashboard"],
    tagline: "Class schedules without the conflicts",
    summary:
      "A class scheduling system for a school's technology department: instructors, subjects, sections, rooms, curriculums, and announcements, managed from one admin dashboard.",
    year: "2025",
    stack: ["Django"],
    icon: "calendar",
    platform: "web",
    screens: { web: "/projects/ace-sched/web-dashboard.webp" },
    gallery: [
      { src: "/projects/ace-sched/web-dashboard.webp", caption: "Admin dashboard with totals, quick actions, and recent activity", kind: "web" },
      { src: "/projects/ace-sched/web-rooms.webp", caption: "Rooms with capacity, type, and availability", kind: "web" },
      { src: "/projects/ace-sched/web-users.webp", caption: "User management with roles and account status", kind: "web" },
    ],
    cover: { base: "#111833", glow: "#6b7bff" },
    featured: true,
    problem:
      "Building a semester schedule means matching instructors, sections, subjects, and rooms without double-booking any of them. In a spreadsheet, conflicts are easy to miss.",
    solution:
      "A.C.E Sched keeps every piece of the schedule in one place. Admins set up instructors, subjects, sections, and rooms, then build class schedules on top of them and see at once which rooms are free.",
    features: [
      {
        title: "Admin dashboard",
        body: "Totals for instructors, sections, schedules, subjects, rooms, and curriculums, plus quick actions and recent activity.",
      },
      {
        title: "Rooms",
        body: "Each room's capacity, floor, and type (lecture or laboratory), with its status and schedule.",
      },
      {
        title: "Class schedules",
        body: "Sections, subjects, and instructors assigned to rooms and time slots.",
      },
      {
        title: "Users and announcements",
        body: "Instructor and admin accounts, and announcements posted to everyone.",
      },
    ],
  },
  {
    slug: "tingi",
    name: "TINGI",
    short: "Recycling Rewards",
    badges: ["Team project", "Sustainability", "Plastic recycling"],
    tagline: "Small plastics. Big change.",
    summary:
      "A mobile app that rewards households for recycling plastics, turning every collection into points they can redeem for rewards.",
    year: "2025",
    status: "Prototype",
    role: "Full-stack developer",
    team: "Team of 3",
    timeline: "8 weeks",
    stack: ["React", "AsyncStorage", "UI/UX"],
    icon: "recycle",
    platform: "mobile",
    screens: { mobile: "/projects/tingi/mobile-light.jpg" },
    cover: { base: "#0d2318", glow: "#3fbf6f" },
    featured: true,
    problem:
      "Many households want to recycle but see no direct benefit, and small collection points have no easy way to track who contributes.",
    solution:
      "TINGI logs each drop-off, converts it into points, and lets users redeem them in a built-in marketplace. Collection points get a simple log of every contribution.",
    features: [
      {
        title: "Drop-off logging",
        body: "Collectors record material type and weight in a few taps.",
      },
      {
        title: "Points wallet",
        body: "Users see their balance and history, which keeps them motivated to recycle more.",
      },
      {
        title: "Rewards marketplace",
        body: "Partner stores list items that can be redeemed with points.",
      },
    ],
    outcomes: [
      "Clear incentive loop for households",
      "Marketplace feature added after user feedback",
      "Offline-first storage for low-connectivity areas",
    ],
    lessons:
      "Incentives drive behavior. Small, visible rewards kept test users engaged more than any reminder did.",
  },
  {
    slug: "ascrem",
    name: "ASCREM",
    short: "Attendance and Grades",
    badges: ["Personal project", "Education", "PDF and Excel export"],
    tagline: "Class attendance, grades, and reports",
    summary:
      "A web system for teachers to manage classes, take attendance, record grades, and generate attendance, grade, and class summary reports as PDF or Excel files.",
    year: "2025",
    stack: ["Django"],
    icon: "clipboard",
    platform: "web",
    screens: { web: "/projects/ascrem/web-reports.webp" },
    gallery: [{ src: "/projects/ascrem/web-reports.webp", caption: "Reports panel with PDF and Excel export", kind: "web" }],
    cover: { base: "#10143a", glow: "#f5c518" },
    featured: true,
    problem:
      "Teachers often keep attendance and grades in separate notebooks or spreadsheets, then rebuild the same numbers by hand whenever a report is due.",
    solution:
      "ASCREM keeps classes, attendance, and grades together, so reports come straight from the records. Pick a class and export the report you need.",
    features: [
      {
        title: "Classes",
        body: "Each class with its own students, attendance, and grades.",
      },
      {
        title: "Attendance",
        body: "Attendance per class, with each student's attendance percentage.",
      },
      {
        title: "Grades",
        body: "Scores and final grades recorded per student.",
      },
      {
        title: "Reports",
        body: "Attendance reports, grade reports, and class summaries, exported as PDF or Excel.",
      },
    ],
  },
  {
    slug: "family-feud",
    name: "Family Feud",
    short: "Game Show",
    badges: ["Commissioned by a school", "Live event", "Second screen"],
    tagline: "The classic survey game, ready for a classroom or a party",
    summary:
      "A web version of the Family Feud game show, commissioned by a school for its Student Night: two teams, an editable question bank, game settings, a language option, and a separate TV display for the audience.",
    year: "2026",
    stack: ["Next.js"],
    icon: "game",
    platform: "web",
    screens: { web: "/projects/family-feud/web-home.webp" },
    webFit: "whole",
    gallery: [
      { src: "/projects/family-feud/web-home.webp", caption: "Game stage with team panels and host controls", kind: "web" },
    ],
    cover: { base: "#0c1640", glow: "#ff9a1f" },
    featured: true,
    problem:
      "The school wanted a Family Feud round for its Student Night. Run with slides and a paper scoreboard, a game show loses its pace and the audience loses track of the score.",
    solution:
      "The game runs in the browser. The host controls the rounds from one screen while the audience watches a separate TV display.",
    features: [
      {
        title: "Two-team play",
        body: "Team 1 and Team 2 panels on a game-show stage.",
      },
      {
        title: "Question bank",
        body: "Questions and survey answers that can be edited before the event.",
      },
      {
        title: "TV display",
        body: "A separate audience screen, so the host's controls stay off the big screen.",
      },
      {
        title: "Settings and language",
        body: "Game options and a language switch for the audience.",
      },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
