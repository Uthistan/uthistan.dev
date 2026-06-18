"use client";
import { useEffect, useRef } from "react";
import { projects } from "@/lib/data";

export default function Work() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      if (window.innerWidth < 768) return;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(ref.current!.querySelectorAll(".proj-row"), {
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
        opacity: 0, x: -18, stagger: 0.09, duration: 0.65, ease: "power3.out",
      });
    };
    init();
  }, []);

  return (
    <section ref={ref} id="work" className="px-5 md:px-12 pt-12 md:pt-20 pb-0" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex justify-between items-end mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase" style={{ color: "var(--dim2)" }}>
          <span className="inline-flex w-5 h-5 border rounded-full items-center justify-center text-[9px]" style={{ borderColor: "var(--b2)" }}>01</span>
          Selected work
        </div>
        <div className="text-[11px] tracking-[0.06em]" style={{ color: "var(--dim2)" }}>05 projects</div>
      </div>

      {projects.map((p) => (
        <div key={p.num} className="proj-row grid gap-6 py-6 relative overflow-hidden cursor-none" style={{ gridTemplateColumns: "52px 1fr 96px 28px", borderBottom: "1px solid var(--border)" }}>
          <div className="proj-fill" />
          <div className="text-[10px] tracking-[0.06em] relative z-10" style={{ color: "var(--dim2)" }}>{p.num}</div>
          <div className="relative z-10">
            <div className="proj-name text-[17px] font-medium tracking-[-0.02em] mb-1 transition-colors duration-300">{p.name}</div>
            <div className="text-[12px] leading-[1.5] mb-2" style={{ color: "var(--dim)" }}>"{p.hook}"</div>
            <div className="flex gap-1 flex-wrap">
              {p.tags.map((t) => (
                <span key={t} className="proj-tag text-[10px] px-2 py-0 border rounded-full tracking-[0.03em] transition-[border-color] duration-300" style={{ border: "1px solid var(--b2)", color: "var(--dim2)" }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="proj-yr text-[11px] relative z-10" style={{ color: "var(--dim2)" }}>{p.year}</div>
          <div className="proj-arrow text-[15px] relative z-10 opacity-0 -translate-x-2 transition-[opacity,transform] duration-300" style={{ color: "var(--gold)" }}>↗</div>
        </div>
      ))}
    </section>
  );
}
