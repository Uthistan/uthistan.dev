"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

import Loader from "@/components/ui/Loader";
import Navbar from "@/components/ui/Navbar";
import Marquee from "@/components/ui/Marquee";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Banner from "@/components/sections/Banner";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

// Cursor is client-only (uses mouse events)
const Cursor = dynamic(() => import("@/components/ui/Cursor"), { ssr: false });

// Services loads after mount to avoid SSR issues with sticky scroll
const Services = dynamic(() => import("@/components/sections/Services"), { ssr: false });

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
