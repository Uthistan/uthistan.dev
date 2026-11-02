import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://uthistan.com"),

  title: "Uthistan — Full-Stack Engineer",
  description:
    "Full-stack engineer building web apps, mobile products, CRMs and SaaS platforms. Bengaluru, India.",

  keywords: [
    "full-stack engineer",
    "freelance developer",
    "React",
    "Next.js",
    "CRM",
    "SaaS",
    "Bengaluru",
    "India",
  ],

  authors: [{ name: "Uthistan" }],
  creator: "Uthistan",

  openGraph: {
    title: "Uthistan — Full-Stack Engineer",
    description:
      "The engineer your business hires once and keeps calling back.",
    type: "website",
    url: "https://uthistan.com/",
    siteName: "Uthistan Portfolio",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Uthistan — Full-Stack Engineer",
    description:
      "The engineer your business hires once and keeps calling back.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  alternates: {
    canonical: "https://uthistan.com/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Uthistan",
  jobTitle: "Full-Stack Engineer",
  url: "https://uthistan.com/",
  email: "uthistanravi@gmail.com",
  description:
    "Full-stack engineer building web apps, mobile products, CRMs and SaaS platforms.",
  sameAs: ["https://linkedin.com/in/contactuthistanravi"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t)t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
