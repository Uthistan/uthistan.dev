"use client";
import { useEffect, useRef } from "react";

const LINKS = [
  {
    label: "Email",
    value: "uthistan666@gmail.com",
    href: "mailto:uthistan666@gmail.com",
  },
  { label: "WhatsApp", value: "+91 95852 38558", href: "#" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/contactuthistanravi",
    href: "https://linkedin.com/in/contactuthistanravi",
    target: "_blank",
    rel: "noopener noreferrer",
  },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      if (window.innerWidth < 768) return;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current!;
      gsap.from(el.querySelector(".ct-title"), {
        scrollTrigger: { trigger: el, start: "top 82%" },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(el.querySelectorAll(".ct-link"), {
        scrollTrigger: { trigger: el, start: "top 80%" },
        opacity: 0,
        x: -12,
        stagger: 0.09,
        duration: 0.55,
        ease: "power2.out",
      });
      gsap.from(el.querySelectorAll(".cf-field"), {
        scrollTrigger: { trigger: el.querySelector(".cf"), start: "top 82%" },
        opacity: 0,
        y: 12,
        stagger: 0.07,
        duration: 0.5,
        ease: "power2.out",
      });
    };
    init();
  }, []);

  return (
    <section
      ref={ref}
      id="contact"
      className="ct-section grid px-5 md:px-12 py-16 md:py-24 gap-8 md:gap-20"
      style={{
        gridTemplateColumns: "1fr 1.4fr",
        borderBottom: "1px solid var(--border)",
        alignItems: "start",
      }}
    >
      <div>
        <div
          className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase mb-9"
          style={{ color: "var(--dim2)" }}
        >
          <span
            className="inline-flex w-5 h-5 border rounded-full items-center justify-center text-[9px]"
            style={{ borderColor: "var(--b2)" }}
          >
            05
          </span>
          Contact
        </div>
        <h2
          className="ct-title font-medium leading-[1.05] mb-5"
          style={{
            fontSize: "clamp(2rem,3.5vw,3.4rem)",
            letterSpacing: "-0.04em",
          }}
        >
          Tell me what
          <br />
          you're{" "}
          <em
            style={{
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--gold)",
            }}
          >
            building.
          </em>
        </h2>
        <p
          className="text-[13px] leading-[1.8] mb-10"
          style={{ color: "var(--dim)" }}
        >
          Even if it's just an idea. I'll tell you if I can help — and how.
        </p>
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="ct-link flex justify-between items-center py-4 cursor-none transition-[border-color] duration-300"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="text-[10px] tracking-[0.12em] uppercase"
              style={{ color: "var(--dim2)" }}
            >
              {l.label}
            </span>
            <span
              className="ct-v text-[13px] transition-colors duration-300"
              style={{ color: "var(--dim)" }}
            >
              {l.value} ↗
            </span>
          </a>
        ))}
      </div>
      <div className="cf flex flex-col gap-3">
        {[
          { type: "text", placeholder: "Your name", auto: "name" },
          { type: "email", placeholder: "Email address", auto: "email" },
          {
            type: "text",
            placeholder: "Project type  (Web app / CRM / SaaS / Mobile)",
            auto: "",
          },
        ].map((f) => (
          <input
            key={f.placeholder}
            className="cf-field w-full rounded-lg px-[18px] py-4 text-[13px] outline-none transition-[border-color] duration-300"
            style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid var(--b2)",
              color: "var(--ink)",
              fontFamily: "inherit",
            }}
            type={f.type}
            placeholder={f.placeholder}
            autoComplete={f.auto || undefined}
            suppressHydrationWarning
          />
        ))}
        <textarea
          className="cf-field w-full rounded-lg px-[18px] py-4 text-[13px] outline-none resize-none transition-[border-color] duration-300"
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid var(--b2)",
            color: "var(--ink)",
            fontFamily: "inherit",
            height: 110,
          }}
          placeholder="Tell me about your project..."
          suppressHydrationWarning
        />
        <button
          className="w-full py-4 rounded-lg text-[11px] font-semibold tracking-[0.08em] uppercase mt-1 transition-opacity duration-200 hover:opacity-85"
          style={{ background: "var(--gold)", color: "#070707" }}
        >
          Send message ↗
        </button>
      </div>
    </section>
  );
}
