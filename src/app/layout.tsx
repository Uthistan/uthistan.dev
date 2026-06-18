import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uthistan — Full-Stack Engineer",
  description: "Full-stack engineer building web apps, mobile products, CRMs and SaaS platforms. Bengaluru, India.",
  keywords: ["full-stack engineer", "freelance developer", "React", "Next.js", "CRM", "SaaS", "Bengaluru"],
  openGraph: {
    title: "Uthistan — Full-Stack Engineer",
    description: "The engineer your business hires once and keeps calling back.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', system-ui, sans-serif" }} suppressHydrationWarning>{children}</body>
    </html>
  );
}
