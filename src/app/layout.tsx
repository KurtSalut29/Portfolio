import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { ScrollRail } from "@/components/nav/ScrollRail";
import { Sidebar } from "@/components/nav/Sidebar";
import { MobileNav } from "@/components/nav/MobileNav";
import { profile } from "@/content/profile";
import { SITE_URL, realProfiles, seo } from "@/content/seo";
import { Intro } from "@/components/intro/Intro";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: ["500"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: seo.title, template: `%s — ${profile.fullName}` },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: profile.fullName, url: SITE_URL }],
  creator: profile.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.fullName,
    title: seo.title,
    description: seo.description,
    locale: "en_US",
    firstName: profile.firstName,
    lastName: profile.lastName,
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  // Ownership checks for Google Search Console and Bing Webmaster Tools, once you have the codes.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

/** Tells search engines who the site is about: the basis for a name result with sitelinks. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.fullName,
      givenName: profile.firstName,
      familyName: profile.lastName,
      jobTitle: profile.role,
      description: profile.pitch,
      url: SITE_URL,
      image: `${SITE_URL}/profile/avatar-hd.webp`,
      email: `mailto:${profile.email}`,
      address: { "@type": "PostalAddress", addressRegion: "Biliran", addressCountry: "PH" },
      alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
      knowsAbout: seo.keywords.slice(2),
      ...(realProfiles.length ? { sameAs: realProfiles } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: profile.fullName,
      description: seo.description,
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f4f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e17" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${caveat.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <Intro />
        <Providers>
          <a
            href="#main"
            className="sr-only z-[70] rounded-[var(--radius-control)] bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <Sidebar />
          <MobileNav />
          <main id="main" className="min-h-dvh pt-16 pb-[calc(88px+env(safe-area-inset-bottom))] lg:pt-0 lg:pb-0 lg:pl-[var(--sidebar-w)]">
            {children}
          </main>
          <ScrollRail />
        </Providers>
      </body>
    </html>
  );
}
