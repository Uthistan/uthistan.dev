"use client";
import { useEffect, useRef, useState } from "react";

const WA_NUMBER = "919585238558";

const LINKS = [
  {
    label: "Email",
    value: "uthistanravi@gmail.com",
    href: "mailto:uthistanravi@gmail.com",
    target: undefined as string | undefined,
    rel: undefined as string | undefined,
  },
  {
    label: "WhatsApp",
    value: "+91 95852 38558",
    href: `https://wa.me/${WA_NUMBER}`,
    target: "_blank",
    rel: "noopener noreferrer",
  },
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
  const [form, setForm] = useState({ name: "", email: "", projectType: "", message: "" });
  const [error, setError] = useState("");

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
      ScrollTrigger.refresh();
    };
    init();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { name, email, projectType, message } = form;
    if (!name.trim() || !email.trim() || !projectType.trim() || !message.trim()) {
      setError("Please fill in all fields before sending.");
      return;
    }
    setError("");
    const text = `Hi Uthistan,\n\nName: ${name}\nEmail: ${email}\nProject type: ${projectType}\n\n${message}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

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
          you&apos;re{" "}
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
          Even if it&apos;s just an idea. I&apos;ll tell you if I can help — and how.
        </p>
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.target}
            rel={l.rel}
            className="ct-link group flex justify-between items-center py-4 cursor-none transition-[border-color] duration-300"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="text-[10px] tracking-[0.12em] uppercase"
              style={{ color: "var(--dim2)" }}
            >
              {l.label}
            </span>
            <span
              className="ct-v text-[13px] transition-colors duration-300 group-hover:text-(--ink)"
              style={{ color: "var(--dim)" }}
            >
              {l.value} ↗
            </span>
          </a>
        ))}
      </div>
      <form className="cf flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
        <label htmlFor="cf-name" className="sr-only">Your name</label>
        <input
          id="cf-name"
          className="cf-field w-full rounded-lg px-4.5 py-4 text-[13px] outline-none transition-[border-color,box-shadow] duration-300"
          style={{ background: "var(--input-bg)", border: "1px solid var(--b2)", color: "var(--ink)", fontFamily: "inherit" }}
          type="text"
          placeholder="Your name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <label htmlFor="cf-email" className="sr-only">Email address</label>
        <input
          id="cf-email"
          className="cf-field w-full rounded-lg px-4.5 py-4 text-[13px] outline-none transition-[border-color,box-shadow] duration-300"
          style={{ background: "var(--input-bg)", border: "1px solid var(--b2)", color: "var(--ink)", fontFamily: "inherit" }}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <label htmlFor="cf-project" className="sr-only">Project type</label>
        <input
          id="cf-project"
          className="cf-field w-full rounded-lg px-4.5 py-4 text-[13px] outline-none transition-[border-color,box-shadow] duration-300"
          style={{ background: "var(--input-bg)", border: "1px solid var(--b2)", color: "var(--ink)", fontFamily: "inherit" }}
          type="text"
          placeholder="Project type  (Web app / CRM / SaaS / Mobile)"
          value={form.projectType}
          onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
        />
        <label htmlFor="cf-message" className="sr-only">Tell me about your project</label>
        <textarea
          id="cf-message"
          className="cf-field w-full rounded-lg px-4.5 py-4 text-[13px] outline-none resize-none transition-[border-color,box-shadow] duration-300"
          style={{ background: "var(--input-bg)", border: "1px solid var(--b2)", color: "var(--ink)", fontFamily: "inherit", height: 110 }}
          placeholder="Tell me about your project..."
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        />
        {error && (
          <p role="alert" className="text-[11px] tracking-[0.03em]" style={{ color: "#e07070" }}>{error}</p>
        )}
        <button
          type="submit"
          className="w-full py-4 rounded-lg text-[11px] font-semibold tracking-[0.08em] uppercase mt-1 transition-opacity duration-200 hover:opacity-85 cursor-pointer"
          style={{ background: "var(--gold)", color: "#070707" }}
        >
          Send via WhatsApp ↗
        </button>
      </form>
    </section>
  );
}
