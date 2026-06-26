"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";

const ROLES = [
  "Full-Stack Engineer",
  "React Developer",
  "Mobile App Builder",
  "SaaS Architect",
  "API Designer",
];

export default function Hero({ ready }: { ready: boolean }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  const roles = useMemo(() => ROLES, []);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(
      () => setRoleIndex((i) => (i + 1) % roles.length),
      2400,
    );
    return () => clearTimeout(id);
  }, [roleIndex, roles.length]);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    let cleanupAsync: (() => void) | null = null;

    const animate = async () => {
      if (!alive) return;
      if (window.innerWidth < 768) return;

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(".h-wd", { y: "115%" });

      const words = titleRef.current?.querySelectorAll(".h-wd");
      if (words?.length) gsap.to(words, { y: "0%", stagger: 0.1, duration: 1, ease: "power4.out" });
      gsap.to(titleRef.current, {
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.5 },
        y: -80, opacity: 0.15,
      });

      const canvas = document.getElementById("orb") as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      let W = 0, H = 0;
      const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      const pts = Array.from({ length: 400 }, () => {
        const a = Math.random() * Math.PI * 2, r = 130 + Math.random() * 200;
        return { tx: Math.cos(a) * r, ty: Math.sin(a) * r * 0.8, p: Math.random(), sp: 0.0007 + Math.random() * 0.001, sz: 0.3 + Math.random() * 1.4, al: 0.08 + Math.random() * 0.38, h: 24 + Math.random() * 22 };
      });

      let sy = 0;
      const onScroll = () => { sy = window.scrollY; };
      window.addEventListener("scroll", onScroll, { passive: true });

      let rafId: number;
      const draw = () => {
        if (!alive) return;
        ctx.clearRect(0, 0, W, H);
        const heroH = canvas.parentElement?.offsetHeight ?? H;
        const fade = Math.max(0, 1 - sy / heroH * 1.5);
        if (fade > 0) {
          const cx = W / 2, cy = H * 0.43;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 240);
          g.addColorStop(0, "rgba(200,158,96,.06)"); g.addColorStop(1, "transparent");
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
          pts.forEach(p => {
            p.p += p.sp; if (p.p > 1) p.p = 0;
            const e = p.p < 0.5 ? 2 * p.p * p.p : -1 + (4 - 2 * p.p) * p.p;
            ctx.beginPath(); ctx.arc(cx + p.tx * e, cy + p.ty * e, p.sz, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.h + 10},45%,72%,${p.al * fade})`; ctx.fill();
          });
        }
        rafId = requestAnimationFrame(draw);
      };
      draw();

      cleanupAsync = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", onScroll);
        ro.disconnect();
      };
    };

    animate();

    return () => {
      alive = false;
      cleanupAsync?.();
    };
  }, [ready]);

  return (
    <section
      id="hero"
      className="min-h-svh flex flex-col justify-center md:justify-end items-center md:items-start px-5 md:px-12 pb-0 md:pb-14 relative overflow-hidden"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <canvas id="orb" className="absolute inset-0 pointer-events-none" style={{ opacity: 0.55 }} aria-hidden="true" />

      {/* Eyebrow — animated cycling role */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
        className="flex items-center justify-center md:justify-start gap-3 mb-7 text-[10px] tracking-[0.18em] uppercase relative z-10 w-full"
        style={{ color: "var(--dim2)" }}
      >
        <span className="w-6 h-px shrink-0" style={{ background: "var(--dim2)" }} />

        <span
          className="relative inline-flex overflow-hidden"
          style={{ height: "1.3em" }}
          aria-label={roles[roleIndex]}
        >
          {roles.map((role, i) => (
            <motion.span
              key={role}
              className="absolute whitespace-nowrap"
              initial={{ opacity: 0, y: "110%" }}
              animate={
                roleIndex === i
                  ? { opacity: 1, y: "0%" }
                  : { opacity: 0, y: roleIndex > i ? "-110%" : "110%" }
              }
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            >
              {role}
            </motion.span>
          ))}
        </span>

        <span className="shrink-0" aria-hidden="true">· Bengaluru, India</span>
      </motion.div>

      {/* Main headline */}
      <h1
        ref={titleRef}
        className="relative z-10 w-full text-center md:text-left"
        style={{ fontSize: "clamp(3.4rem,8.5vw,9rem)", fontWeight: 500, letterSpacing: "-0.055em", lineHeight: 0.91 }}
      >
        {["The engineer your", "business hires once", "and keeps calling back."].map((line, i) => (
          <span key={i} className="block overflow-hidden">
            <span className="h-wd block">
              {i === 1 ? (
                <>business hires <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>once</em></>
              ) : i === 2 ? (
                <>and keeps <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>calling back.</em></>
              ) : line}
            </span>
          </span>
        ))}
      </h1>

      {/* Footer bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="flex flex-col md:flex-row md:justify-between md:items-end items-center gap-6 md:gap-0 mt-8 md:mt-12 pt-6 md:pt-8 relative z-10 w-full"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p
          className="text-[13px] leading-[1.82] max-w-72.5 text-center md:text-left"
          style={{ color: "var(--dim)" }}
        >
          I build web apps, mobile products, CRMs and SaaS platforms — for startups, SMBs, and everything in between.
        </p>

        <div className="flex flex-col items-center md:items-end gap-4">
          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-9 md:py-4 rounded-full text-[11px] md:text-[13px] font-bold tracking-[0.07em] uppercase transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: "var(--gold)",
                color: "#070707",
                boxShadow: "0 0 28px rgba(201,185,155,0.35), 0 4px 16px rgba(201,185,155,0.2)",
              }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start a project
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-9 md:py-4 rounded-full text-[11px] md:text-[13px] font-medium tracking-[0.07em] uppercase transition-all duration-200 hover:border-(--gold) hover:text-(--ink) hover:shadow-[0_0_18px_rgba(201,185,155,0.25)] hover:scale-[1.04] active:scale-[0.97]"
              style={{ border: "1px solid var(--b2)", color: "var(--dim)" }}
              onClick={() => window.location.href = "mailto:uthistanravi@gmail.com"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .19h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              Schedule a call
            </button>
          </div>

          {/* Scroll cue */}
          <div className="flex items-center gap-2 text-[10px] tracking-[0.14em] uppercase" style={{ color: "var(--dim2)" }}>
            <span className="scan-line w-8 h-px relative overflow-hidden" style={{ background: "var(--dim2)" }} />
            Scroll to explore
          </div>
        </div>
      </motion.div>
    </section>
  );
}
