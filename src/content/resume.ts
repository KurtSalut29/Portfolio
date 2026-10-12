/**
 * What goes on the one-page resume. Kept separate from the portfolio on purpose:
 * the site shows every project, the resume only the strongest few, written as achievements.
 * Aim for one page: 3 to 4 projects, 2 bullets each.
 */

export type ResumeProject = {
  /** Must match a slug in src/content/projects.ts; name, year, and stack come from there. */
  slug: string;
  label: "Client Project" | "Team Project" | "Personal Project" | "Commissioned";
  bullets: string[];
};

export const resume = {
  summary:
    "Software developer who builds web and mobile apps end to end, from interface design to APIs and databases. Has built systems for a client business and a school event, working in Next.js, Flutter, Django, and PHP, and trained a custom machine learning model for a mobile app.",

  projects: [
    {
      slug: "ziren",
      label: "Team Project",
      bullets: [
        "Lead developer of a mobile and web system for disaster reporting in Biliran Province, leading a team of 4 from UI design to the AI-assisted features.",
        "Built a Flutter reporting app with GPS and photos, a Next.js responder dashboard, and a FastAPI service that uses NLP to suggest incident type and severity.",
      ],
    },
    {
      slug: "rm-hardware",
      label: "Client Project",
      bullets: [
        "Built an inventory, point of sale, and delivery system for a client's hardware store, with separate dashboards for admins and staff.",
        "Added a live delivery map with Leaflet and OpenStreetMap, plus low-stock alerts and a six-month sales overview.",
      ],
    },
    {
      slug: "rockalyzer",
      label: "Personal Project",
      bullets: [
        "Trained an image classification model on rock photos and built a Flutter app around it that identifies a rock from the camera or gallery.",
        "Shows each result's rock type and confidence score, and saves finds to a personal collection.",
      ],
    },
    {
      slug: "family-feud",
      label: "Commissioned",
      bullets: [
        "Built a browser-based Family Feud game show for a school's Student Night, with two-team play and an editable question bank.",
        "Separated the host controls from a second audience TV display so the game ran live without slides or paper scoring.",
      ],
    },
  ] satisfies ResumeProject[],

  /** Shown as a short list; the newest first. */
  certificationsShown: 4,
};
