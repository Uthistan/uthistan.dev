"use client";
import { useEffect, useRef } from "react";

export default function Hero({ ready }: { ready: boolean }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    let cleanupAsync: (() => void) | null = null;

    const animate = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!alive) return;

      gsap.set(".h-wd", { y: "115%" });

      const words = titleRef.current?.querySelectorAll(".h-wd");
      if (words?.length) gsap.to(words, { y: "0%", stagger: 0.1, duration: 1, ease: "power4.out" });
      if (eyeRef.current) gsap.from(eyeRef.current, { opacity: 0, y: 10, duration: 0.6, ease: "power2.out", delay: 0.3 });
      if (footRef.current) gsap.from(footRef.current, { opacity: 0, y: 16, duration: 0.7, ease: "power2.out", delay: 0.6 });

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
    <section id="hero" className="min-h-screen flex flex-col justify-end px-5 md:px-12 pb-10 md:pb-14 relative overflow-hidden" style={{ borderBottom: "1px solid var(--border)" }}>
      <canvas id="orb" className="absolute inset-0 pointer-events-none" style={{ opacity: 0.55 }} aria-hidden="true" />

      <div ref={eyeRef} className="flex items-center gap-3 mb-7 text-[10px] tracking-[0.18em] uppercase relative z-10" style={{ color: "var(--dim2)" }}>
        <span className="w-6 h-px" style={{ background: "var(--dim2)" }} />
        Full-Stack Engineer · Bengaluru, India
      </div>

      <h1 ref={titleRef} className="relative z-10" style={{ fontSize: "clamp(3.4rem,8.5vw,9rem)", fontWeight: 500, letterSpacing: "-0.055em", lineHeight: 0.91 }}>
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

      <div ref={footRef} className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 md:gap-0 mt-8 md:mt-12 pt-6 md:pt-8 relative z-10" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-[13px] leading-[1.82] max-w-[290px]" style={{ color: "var(--dim)" }}>
          I build web apps, mobile products, CRMs and SaaS platforms — for startups, SMBs, and everything in between.
        </p>
        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="inline-flex items-center gap-2 text-[11px] px-4 py-2 rounded-full" style={{ border: "1px solid var(--b2)", color: "var(--dim2)" }}>
            <span className="avail-dot w-[6px] h-[6px] rounded-full" style={{ background: "#4ade80" }} />
            Available for projects
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.14em] uppercase" style={{ color: "var(--dim2)" }}>
            <span className="scan-line w-8 h-px relative overflow-hidden" style={{ background: "var(--dim2)" }} />
            Scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}
