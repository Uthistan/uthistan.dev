"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener("portfolio:ready", show, { once: true });
    return () => window.removeEventListener("portfolio:ready", show);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[500] flex justify-between items-center px-5 md:px-12 py-4 md:py-5 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ background: "linear-gradient(180deg,rgba(8,8,8,.9) 0%,transparent 100%)" }}
    >
      <a href="#hero" className="text-sm font-semibold tracking-[-0.025em]">
        Uthistan<span style={{ color: "var(--gold)" }}>.</span>
      </a>
      <ul className="hidden md:flex gap-7 list-none">
        {["work", "svc-wrap", "about", "contact"].map((id, i) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
              className="text-[11px] tracking-[0.1em] uppercase transition-colors hover:text-[var(--ink)]"
              style={{ color: "var(--dim)" }}
            >
              {["Work", "Services", "About", "Contact"][i]}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => scrollTo("contact")}
        className="text-[11px] tracking-[0.08em] uppercase px-5 py-2 rounded-full border transition-all hover:border-(--gold) hover:text-(--ink) hover:shadow-[0_0_18px_rgba(201,185,155,0.35)]"
        style={{ border: "1px solid var(--b2)", color: "var(--dim)" }}
      >
        Let's talk
      </button>
    </nav>
  );
}
