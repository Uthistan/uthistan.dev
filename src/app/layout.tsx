import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});


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
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
