"use client";
import { useEffect, useRef, useState } from "react";
import { faqs } from "@/lib/data";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current!;
      gsap.from(el.querySelector(".fq-title"), { scrollTrigger: { trigger: el, start: "top 82%" }, opacity: 0, y: 24, duration: 0.8, ease: "power3.out" });
      gsap.from(el.querySelectorAll(".fqi"), { scrollTrigger: { trigger: el, start: "top 80%" }, opacity: 0, y: 12, stagger: 0.08, duration: 0.55, ease: "power2.out" });
    };
    init();
  }, []);

  return (
    <section ref={ref} id="faq" className="faq-section grid px-5 md:px-12 py-16 md:py-24 gap-8 md:gap-20" style={{ gridTemplateColumns: "1fr 1.5fr", borderBottom: "1px solid var(--border)", alignItems: "start" }}>
      <div>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase mb-9" style={{ color: "var(--dim2)" }}>
          <span className="inline-flex w-5 h-5 border rounded-full items-center justify-center text-[9px]" style={{ borderColor: "var(--b2)" }}>04</span>
          FAQ
        </div>
        <h2 className="fq-title font-medium leading-[1.05]" style={{ fontSize: "clamp(2rem,3.5vw,3.4rem)", letterSpacing: "-0.04em", marginTop: 56 }}>
          Got questions?<br /><em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>I've got answers.</em>
        </h2>
      </div>
      <div>
        {faqs.map((faq, i) => (
          <div key={i} className={`fqi faq-item${open === i ? " open" : ""}`} style={{ borderBottom: "1px solid var(--border)" }}>
            <button
              className="fq-q w-full flex justify-between items-center py-5 gap-4 text-left cursor-none"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="text-[14px] font-medium tracking-[-0.01em]">{faq.q}</span>
              <span className="faq-icon fq-ic text-[22px] flex-shrink-0 leading-none" style={{ color: "var(--dim)" }}>+</span>
            </button>
            <div className="faq-answer fq-a text-[13px] leading-[1.8]" style={{ color: "var(--dim)" }}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
