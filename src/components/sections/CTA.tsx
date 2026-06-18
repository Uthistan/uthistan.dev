"use client";
import { useEffect, useRef } from "react";

export default function CTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current!;
      const words = el.querySelectorAll<HTMLElement>(".cta-wd");
      words.forEach((w) => { w.style.transform = "translateY(115%)"; });
      ScrollTrigger.create({
        trigger: el, start: "top 78%", once: true,
        onEnter: () => {
          gsap.to(words, { y: "0%", stagger: 0.1, duration: 1, ease: "power4.out" });
          gsap.from(el.querySelector(".cta-bts"), { opacity: 0, y: 16, duration: 0.7, delay: 0.4, ease: "power2.out" });
          gsap.from(el.querySelector(".cta-gl"), { scale: 0.5, opacity: 0, duration: 1.2, ease: "power2.out" });
        },
      });
    };
    init();
  }, []);

  return (
    <section ref={ref} id="cta" className="min-h-[80vh] flex flex-col justify-center items-center text-center px-5 md:px-12 py-16 md:py-20 relative overflow-hidden" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="cta-gl absolute w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(201,185,155,.07) 0%,transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div className="text-[10px] tracking-[0.18em] uppercase mb-7 relative z-10" style={{ color: "var(--dim2)" }}>Get in touch</div>
      <h2
        className="relative z-10 mb-12 font-medium"
        style={{ fontSize: "clamp(3.2rem,8.5vw,9rem)", letterSpacing: "-0.055em", lineHeight: 0.91 }}
      >
        {["Got a project", "in mind?", "Let's build it."].map((line, i) => (
          <span key={i} className="cta-ln overflow-hidden block">
            <span className="cta-wd block">
              {i === 2 ? <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>{line}</em> : line}
            </span>
          </span>
        ))}
      </h2>
      <div className="cta-bts flex gap-3 relative z-10 flex-wrap justify-center">
        <button
          className="px-8 py-4 rounded-full text-[11px] font-semibold tracking-[0.07em] uppercase transition-[opacity,transform] hover:opacity-90 hover:scale-[1.02]"
          style={{ background: "var(--gold)", color: "#070707" }}
          onClick={() => { window.location.href = "mailto:hello@uthistan.dev"; }}
        >
          Send me an email ↗
        </button>
        <button
          className="px-8 py-4 rounded-full text-[11px] tracking-[0.07em] uppercase border transition-[border-color,color] hover:border-white/30"
          style={{ border: "1px solid var(--b2)", color: "var(--dim)" }}
        >
          WhatsApp me
        </button>
      </div>
    </section>
  );
}
