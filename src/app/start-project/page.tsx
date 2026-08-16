import type { Metadata } from "next";
import StartProjectForm from "./StartProjectForm";

const TITLE = "Start a Project — Client Declaration | Uthistan";
const DESCRIPTION =
  "Client project declaration and acknowledgement form. Confirm your details, your project, and how we'll work together before development begins.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["client declaration", "project onboarding", "start a project", "web development", "Uthistan"],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://uthistan-portfolio.vercel.app/start-project",
    siteName: "Uthistan Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/start-project",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: TITLE,
  description: DESCRIPTION,
  url: "https://uthistan-portfolio.vercel.app/start-project",
  mainEntity: {
    "@type": "Person",
    name: "Uthistan",
    jobTitle: "Full-Stack Engineer",
    email: "uthistanravi@gmail.com",
    url: "https://uthistan-portfolio.vercel.app",
  },
};

export default function StartProjectPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StartProjectForm />
    </>
  );
}
