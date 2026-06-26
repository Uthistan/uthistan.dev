"use client";
import { useEffect, useState } from "react";

const NAV = [
  { id: "work", label: "Work" },
  { id: "svc-wrap", label: "Services" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// Reads localStorage + system pref on client; returns dark default on SSR
function getInitialDark(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light") return false;
    if (stored === "dark") return true;
    return !window.matchMedia("(prefers-color-scheme: light)").matches;
  } catch {
    return true;
  }
}

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Lazy initializer reads from localStorage on client; SSR mismatch suppressed on button
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener("portfolio:ready", show, { once: true });
    return () => window.removeEventListener("portfolio:ready", show);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.add("theme-transition");
    document.documentElement.classList.toggle("light", !newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    window.setTimeout(() => document.documentElement.classList.remove("theme-transition"), 300);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[500] flex justify-between items-center px-5 md:px-12 py-4 md:py-5 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(180deg,var(--nav-bg) 0%,transparent 100%)" }}
      >
        <a href="#hero" className="text-sm font-semibold tracking-[-0.025em]" style={{ color: "var(--ink)" }}>
          Uthistan<span style={{ color: "var(--gold)" }}>.</span>
        </a>

        <ul className="hidden md:flex gap-7 list-none">
          {NAV.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className="text-[11px] tracking-[0.1em] uppercase transition-colors hover:text-(--ink) cursor-pointer"
                style={{ color: "var(--dim)" }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* suppressHydrationWarning: icon depends on localStorage, differs from SSR */}
          <button
            suppressHydrationWarning
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:text-(--ink) cursor-pointer"
            style={{ color: "var(--dim)" }}
          >
            {dark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => scrollTo("contact")}
            className="hidden md:block text-[11px] tracking-[0.08em] uppercase px-5 py-2 rounded-full border transition-all hover:border-(--gold) hover:text-(--ink) hover:shadow-[0_0_18px_rgba(201,185,155,0.35)] cursor-pointer"
            style={{ border: "1px solid var(--b2)", color: "var(--dim)" }}
          >
            Let&apos;s talk
          </button>

          <button
            onClick={() => setMenuOpen((m) => !m)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] cursor-pointer"
          >
            <span className={`block w-5 h-[1.5px] transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} style={{ background: "var(--ink)" }} />
            <span className={`block w-5 h-[1.5px] transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} style={{ background: "var(--ink)" }} />
            <span className={`block w-5 h-[1.5px] transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} style={{ background: "var(--ink)" }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[490] flex flex-col justify-center items-center gap-8 transition-all duration-300 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "var(--bg)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {NAV.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="text-[2.2rem] font-medium tracking-[-0.03em] transition-colors hover:text-(--ink) cursor-pointer"
            style={{ color: "var(--dim)" }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => scrollTo("contact")}
          className="mt-6 text-[11px] tracking-[0.08em] uppercase px-7 py-3 rounded-full border transition-all hover:border-(--gold) hover:shadow-[0_0_18px_rgba(201,185,155,0.35)] cursor-pointer"
          style={{ border: "1px solid var(--b2)", color: "var(--dim)" }}
        >
          Let&apos;s talk
        </button>
      </div>
    </>
  );
}
