/**
 * What goes on the one-page resume. Kept separate from the portfolio on purpose:
 * the site shows every project, the resume only the strongest few, written as achievements.
 * Aim for one page: 3 to 4 projects, 2 bullets each.
 */

export type ResumeProject = {
  /** Must match a slug in src/content/projects.ts; name, year, and stack come from there. */
  slug: string;
  /** What the project is, in a few words, for the resume's title line. */
  descriptor: string;
  label: "Client Project" | "Team Project" | "Personal Project" | "Commissioned";
  bullets: string[];
};

export const resume = {
  summary:
    "Software developer and Computer Science student who builds web and mobile apps end to end, from interface to database. Projects include a client's inventory and delivery system and a disaster reporting app, built with Next.js, Flutter, and FastAPI.",

  /**
   * The OJT line appears after the summary while both duration and start are filled in.
   * Clear them after the OJT and the resume reads as a regular developer resume again.
   * The phone number is not here on purpose: this repo and /resume are public. See scripts/resume_pdf.py.
   */
  ojt: {
    duration: "3 to 4-month", // Update to the required hours once the coordinator confirms them.
    start: "January 2027",
    expectedGraduation: "", // e.g. "June 2028"; replaces the school years under Education
  },

  projects: [
    {
      slug: "ziren",
      descriptor: "Emergency Reporting System",
      label: "Team Project",
      bullets: [
        "Led a team of 4 as lead developer and UI/UX designer of a disaster reporting system for Biliran Province.",
        "Built a FastAPI service that uses NLP to suggest incident type and severity, which responders confirm or correct on a Next.js dashboard.",
      ],
    },
    {
      slug: "rm-hardware",
      descriptor: "Inventory and Delivery System",
      label: "Client Project",
      bullets: [
        "Built a system that brings a hardware store's inventory, sales, and deliveries into one place, with role-based access for customers, staff, riders, and admins.",
        "Added low-stock alerts and a live delivery map so staff can restock early and customers can follow orders without calling the store.",
      ],
    },
    {
      slug: "family-feud",
      descriptor: "Game Show Web App",
      label: "Commissioned",
      bullets: [
        "Built a browser-based game show for a school's Student Night, with two teams and an editable question bank.",
        "Separated host controls from an audience TV display so the game ran live without slides or paper scoring.",
      ],
    },
    {
      slug: "rockalyzer",
      descriptor: "Rock Identification App",
      label: "Personal Project",
      bullets: [
        "Trained an image classifier in Google Colab and built a Flutter app that identifies rocks from photos.",
        "Displays each result's rock type and confidence score, and saves finds to a personal collection.",
      ],
    },
  ] satisfies ResumeProject[],

  /** Ids from src/content/certificates.ts. Only the ones relevant to tech roles; the site shows them all. */
  certificationIds: ["ai-literacy", "cisco-networking-basics", "asean-fusion-poster"],
};
