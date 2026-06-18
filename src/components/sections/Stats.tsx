"use client";
import { useEffect, useRef } from "react";

const STATS = [
  { id: "s0", target: 5, suffix: "+", label: "Projects shipped" },
  { id: "s1", target: 4, suffix: "", label: "Industries served" },
  { id: "s2", target: 100, suffix: "%", label: "On-time delivery" },
  { id: "s3", target: 3, suffix: "+", label: "Years freelancing" },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(ref.current!.children, {
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
        opacity: 0, y: 28, stagger: 0.1, duration: 0.7, ease: "power3.out",
      });

      ScrollTrigger.create({
        trigger: ref.current, start: "top 80%", once: true,
        onEnter: () => {
          STATS.forEach(({ id, target, suffix }) => {
            const el = document.getElementById(id);
            if (!el) return;
            gsap.to({ v: 0 }, {
              v: target, duration: 1.5, ease: "power2.out",
              onUpdate: function () {
                el.innerHTML = `${Math.round(this.targets()[0].v)}<em style="color:var(--gold);font-style:normal">${suffix}</em>`;
              },
            });
          });
        },
      });
    };
    init();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: "1px solid var(--border)" }}>
      {STATS.map(({ id, target, suffix, label }) => (
        <div key={id} className="stat-item px-6 py-8 md:px-12 md:py-12" style={{ borderRight: "1px solid var(--border)" }}>
          <div
            id={id}
            className="font-medium leading-none"
            style={{ fontSize: "clamp(3rem,5.5vw,5.5rem)", letterSpacing: "-0.055em" }}
          >
            {target}<em style={{ color: "var(--gold)", fontStyle: "normal" }}>{suffix}</em>
          </div>
          <div className="text-[11px] mt-2 tracking-[0.04em]" style={{ color: "var(--dim2)" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
