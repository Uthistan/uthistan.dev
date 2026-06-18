"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

import Loader from "@/components/ui/Loader";
import Navbar from "@/components/ui/Navbar";
import Marquee from "@/components/ui/Marquee";
import Hero from "@/components/sections/Hero";

// Cursor is client-only (uses mouse events)
const Cursor = dynamic(() => import("@/components/ui/Cursor"), { ssr: false });

// Below-fold sections — code-split to reduce initial bundle
const Stats   = dynamic(() => import("@/components/sections/Stats"));
const Work    = dynamic(() => import("@/components/sections/Work"));
const Services = dynamic(() => import("@/components/sections/Services"), { ssr: false });
const About   = dynamic(() => import("@/components/sections/About"));
const Banner  = dynamic(() => import("@/components/sections/Banner"));
const FAQ     = dynamic(() => import("@/components/sections/FAQ"));
const Contact = dynamic(() => import("@/components/sections/Contact"));
const CTA     = dynamic(() => import("@/components/sections/CTA"));
const Footer  = dynamic(() => import("@/components/sections/Footer"));

const MARQUEE_1 = ["Full-Stack Dev", "Mobile Apps", "CRM Systems", "SaaS Products", "API Integrations", "React & Node", "Enterprise"];
const MARQUEE_2 = ["React", "Node.js", "TypeScript", "React Native", "PostgreSQL", "MongoDB", "AWS", "Next.js", "Tailwind", "Docker"];

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaded(true);
    window.dispatchEvent(new Event("portfolio:ready"));
  }, []);

  return (
    <>
      <Cursor />
      <Loader onComplete={handleLoaderComplete} />
      <Navbar />

      <main>
        <Hero ready={loaded} />
        <Marquee items={MARQUEE_1} direction="fwd" />
        <Stats />
        <Work />
        <Services />
        <Marquee items={MARQUEE_2} direction="rev" />
        <About />
        <Banner />
        <FAQ />
        <Contact />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
