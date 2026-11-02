import type { Metadata } from "next";
import { SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import StartProjectForm from "./StartProjectForm";

const PAGE_URL = `${SITE_URL}/start-project`;
// A page-level openGraph block replaces the root one, so the image isn't inherited.
const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: SITE_TITLE };
const TITLE = "Start a Project — Client Declaration | Uthistan";
const DESCRIPTION =
  "Client project declaration and acknowledgement form. Confirm your details, your project, and how we'll work together before development begins.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,

  keywords: [
    "client declaration",
    "project onboarding",
    "start a project",
    "web development",
    "Uthistan",
  ],

  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [SHARE_IMAGE],
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SHARE_IMAGE],
  },

  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },

  alternates: {
    canonical: PAGE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  mainEntity: {
    "@type": "Person",
    name: "Uthistan",
    jobTitle: "Full-Stack Engineer",
    email: "uthistanravi@gmail.com",
    url: `${SITE_URL}/`,
  },
};

export default function StartProjectPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StartProjectForm />
    </>
  );
}
