"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { services } from "@/lib/data";
import { GridVis, PhoneVis, CRMVis, SaaSVis, BrowserVis, APIVis } from "./ServiceVisuals";

const VISUALS = [GridVis, PhoneVis, CRMVis, SaaSVis, BrowserVis, APIVis];
const GN_LABELS = ["01", "02", "03", "04", "05", "06"];

export default function Services() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const swap = useCallback((i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    import("gsap").then(({ gsap }) => {
      if (textRef.current) {
        gsap.killTweensOf(textRef.current);
        gsap.set(textRef.current, { opacity: 0, y: 8 });
      }
      setActive(i);
      if (textRef.current) {
        gsap.to(textRef.current, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" });
      }
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const scrolled = -rect.top;
      const wrapH = wrap.offsetHeight - window.innerHeight;
      if (scrolled < 0 || scrolled > wrapH) return;
      const progress = scrolled / wrapH;
      const idx = Math.min(services.length - 1, Math.floor(progress * services.length));
      swap(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [swap]);

  const svc = services[active];

  return (
    <div id="svc-wrap">
      {/* ——— MOBILE: simple card list ——— */}
      <div className="md:hidden" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
        <div className="px-5 py-14">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase mb-10" style={{ color: "var(--dim2)" }}>
            <span className="inline-flex w-5 h-5 border rounded-full items-center justify-center text-[9px]" style={{ borderColor: "var(--b2)" }}>02</span>
            Services
          </div>
          {services.map((s, i) => (
            <div key={i} className="py-8" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="text-[10px] tracking-[0.06em] mb-3" style={{ color: "var(--dim2)" }}>{GN_LABELS[i]}</div>
              <h3 className="font-medium leading-[.96] mb-4" style={{ fontSize: "clamp(1.9rem,7vw,2.8rem)", letterSpacing: "-0.045em" }}>
                {s.line1}<br />
                <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>{s.line2}</em>
              </h3>
              <p className="text-[13px] leading-[1.85] mb-5" style={{ color: "var(--dim)" }}>{s.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {s.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-1 rounded-full" style={{ border: "1px solid var(--b2)", color: "var(--dim2)" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ——— DESKTOP: sticky scroll ——— */}
      <div ref={wrapRef} className="hidden md:block" style={{ position: "relative", background: "var(--bg)" }}>
      {/* Sticky panel */}
      <div
        id="svc-pin"
        style={{
          position: "sticky", top: 0, height: "100vh",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          overflow: "hidden", borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
        }}
      >
        {/* LEFT */}
        <div className="flex flex-col justify-center px-12 py-16" style={{ borderRight: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase mb-9" style={{ color: "var(--dim2)" }}>
            <span className="inline-flex w-5 h-5 border rounded-full items-center justify-center text-[9px]" style={{ borderColor: "var(--b2)" }}>02</span>
            Services
          </div>

          <div ref={textRef}>
            <h2
              className="font-medium leading-[.96] mb-6"
              style={{ fontSize: "clamp(2.6rem,4.5vw,4.4rem)", letterSpacing: "-0.045em" }}
            >
              {svc.line1}<br />
              <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>{svc.line2}</em>
            </h2>
            <p className="text-[14px] leading-[1.85] mb-7 max-w-[380px]" style={{ color: "var(--dim)" }}>
              {svc.desc}
            </p>
            <div className="flex gap-2 flex-wrap mb-10">
              {svc.tags.map((t) => (
                <span key={t} className="text-[10px] px-2 py-1 rounded-full tracking-[0.04em]" style={{ border: "1px solid var(--b2)", color: "var(--dim2)" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] tracking-[0.06em] min-w-[32px]" style={{ color: "var(--dim2)" }}>
              {String(active + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 h-px relative overflow-hidden" style={{ background: "var(--b2)" }}>
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  background: "var(--gold)",
                  width: `${((active + 1) / services.length) * 100}%`,
                  transition: "width .5s cubic-bezier(.25,.46,.45,.94)",
                }}
              />
            </div>
            <span className="text-[11px] tracking-[0.06em]" style={{ color: "var(--dim2)" }}>06</span>
          </div>
        </div>

        {/* RIGHT — animated panels */}
        <div className="relative overflow-hidden" style={{ background: "var(--bg1)" }}>
          {services.map((_, i) => {
            const Visual = VISUALS[i];
            return (
              <div
                key={i}
                className={`svc-panel ${i === active ? "active" : ""}`}
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div
                  className="absolute font-bold pointer-events-none select-none"
                  style={{
                    fontSize: "clamp(10rem,20vw,20rem)",
                    letterSpacing: "-0.08em",
                    color: "rgba(255,255,255,.025)",
                    lineHeight: 1,
                    top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                >
                  {GN_LABELS[i]}
                </div>
                <div className="relative z-10">
                  <Visual />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacer — 600vh drives the pin duration */}
      <div style={{ height: "600vh" }} />
      </div>
    </div>
  );
}
