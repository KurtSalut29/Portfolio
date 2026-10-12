/**
 * Certificates and recognition. Newest first.
 * Images live in public/images/certificates. The first image is the cover; extra pages show in the viewer.
 */

export type CertificateKind = "Award" | "Course" | "Micro-credential" | "Seminar" | "Webinar";

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  kind: CertificateKind;
  date: string;
  /** ISO date, for sorting and <time>. */
  iso: string;
  summary: string;
  credentialId?: string;
  images: { src: string; width: number; height: number; alt: string }[];
};

export const certificates: Certificate[] = [
  {
    id: "ai-literacy",
    title: "Introduction to AI Literacy and Responsible Use",
    issuer: "CHED ACHIEVE × Mapúa University",
    kind: "Micro-credential",
    date: "Sep 14, 2026",
    iso: "2026-09-14",
    summary: "How AI tools work, where they fail, and how to use them responsibly in study and work.",
    credentialId: "KZ3VP5VR6KA3X",
    images: [
      {
        src: "/images/certificates/ai-literacy.png",
        width: 770,
        height: 539,
        alt: "Certificate of Completion for Introduction to AI Literacy and Responsible Use, issued to Kurt Michael Salut on 14 September 2026.",
      },
    ],
  },
  {
    id: "cisco-networking-basics",
    title: "Networking Basics",
    issuer: "Cisco Networking Academy",
    kind: "Course",
    date: "May 9, 2026",
    iso: "2026-05-09",
    summary: "Ethernet, IPv4 and IPv6 addressing, routing, and setting up a secure wireless network.",
    credentialId: "362fda6e-36da-4dfd-a9a3-e41ea224427c",
    images: [
      {
        src: "/images/certificates/cisco-networking-basics.png",
        width: 715,
        height: 483,
        alt: "Cisco Networking Academy certificate awarded to Kurt Salut for completing Networking Basics on 9 May 2026.",
      },
      {
        src: "/images/certificates/cisco-networking-basics-skills.png",
        width: 699,
        height: 539,
        alt: "Cisco Certificate of Course Completion for Networking Basics, listing the skills achieved.",
      },
    ],
  },
  {
    id: "integrated-os-webinar",
    title: "Integrated OS: Be More Digi-TALINO",
    issuer: "Integrated Office Solutions, Inc.",
    kind: "Webinar",
    date: "Sep 5, 2025",
    iso: "2025-09-05",
    summary: "Digital literacy: productivity apps, digital communication, smart research, and data security.",
    images: [
      {
        src: "/images/certificates/integrated-os-webinar.jpg",
        width: 1755,
        height: 1240,
        alt: "Certificate of Participation in the Integrated OS – Be More Digi-TALINO webinar, 5 September 2025.",
      },
    ],
  },
  {
    id: "asean-fusion-poster",
    title: "4th Place, Digital Poster Making",
    issuer: "2nd ASEAN Fusion 2025, Ifugao State University",
    kind: "Award",
    date: "Aug 29, 2025",
    iso: "2025-08-29",
    summary: "Category B, on the theme “Inclusivity and Sustainability” for ASEAN's 58th founding anniversary.",
    images: [
      {
        src: "/images/certificates/asean-fusion-poster.jpg",
        width: 2000,
        height: 1414,
        alt: "Certificate of Recognition for fourth place in the Digital Poster Making Competition, 2nd ASEAN Fusion 2025.",
      },
    ],
  },
  {
    id: "bipsu-english-seminar",
    title: "Mastering English Foundations, Academic Integrity, and Gender-Fair Writing",
    issuer: "BiPSU Computer Science Society",
    kind: "Seminar",
    date: "Apr 29, 2025",
    iso: "2025-04-29",
    summary: "A seminar-workshop on clear technical English, academic honesty, and inclusive writing.",
    images: [
      {
        src: "/images/certificates/bipsu-english-seminar.jpg",
        width: 1753,
        height: 1240,
        alt: "Certificate of Completion for the seminar-workshop on Mastering English Foundations, 29 April 2025.",
      },
    ],
  },
];
