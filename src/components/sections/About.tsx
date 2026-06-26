"use client";
import { useEffect, useRef } from "react";
import { skills } from "@/lib/data";

const STORY = [
  "I didn't start freelancing by posting on Upwork. My first client was a friend running a paper import business — tracking 200+ accounts in a notebook. I built them a CRM. That was the moment I understood what software actually does: it gives people time back.",
  "Since then I've worked across industries — from a special education school that needed a digital voice, to an enterprise eProcurement SaaS used by large businesses to manage vendors and contracts.",
  "Every project taught me something different. Vidyanjali taught me design can be an act of care. Zapro.ai showed me what it takes to build at enterprise scale. The crackers website reminded me every business deserves a great digital presence.",
  "I look for clients who care about outcomes, not just deliverables. Problems worth solving. Products worth building.",
];

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      if (window.innerWidth < 768) return;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current!;
      gsap.from(el.querySelector(".ab-title"), { scrollTrigger: { trigger: el, start: "top 82%" }, opacity: 0, y: 28, duration: 0.85, ease: "power3.out" });
      gsap.from(el.querySelectorAll(".sk-row"), { scrollTrigger: { trigger: el, start: "top 80%" }, opacity: 0, x: 12, stagger: 0.07, duration: 0.55, ease: "power2.out" });
      gsap.from(el.querySelectorAll(".ab-p"), { scrollTrigger: { trigger: el, start: "top 78%" }, opacity: 0, y: 16, stagger: 0.1, duration: 0.65, ease: "power2.out" });
      ScrollTrigger.refresh();
    };
    init();
  }, []);

  return (
    <section ref={ref} id="about" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 px-5 md:px-12 py-16 md:py-24" style={{ borderBottom: "1px solid var(--border)" }}>
      <div>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase mb-9" style={{ color: "var(--dim2)" }}>
          <span className="inline-flex w-5 h-5 border rounded-full items-center justify-center text-[9px]" style={{ borderColor: "var(--b2)" }}>03</span>
          About
        </div>
        <h2 className="ab-title font-medium leading-[1.0] mb-10" style={{ fontSize: "clamp(2.2rem,4vw,3.8rem)", letterSpacing: "-0.045em" }}>
          Not just code.<br /><em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>Context.</em>
        </h2>
        {skills.map((s) => (
          <div key={s.name} className="sk-row flex justify-between items-center py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-[13px] font-medium">{s.name}</span>
            <span className="text-[11px] tracking-[0.04em]" style={{ color: "var(--dim)" }}>{s.value}</span>
          </div>
        ))}
      </div>
      <div className="md:pt-16">
        {STORY.map((p, i) => (
          <p key={i} className="ab-p text-[14px] leading-[1.9] mb-5" style={{ color: "var(--dim)" }}>{p}</p>
        ))}
      </div>
    </section>
  );
}
