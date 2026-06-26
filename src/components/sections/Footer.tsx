const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/contactuthistanravi" },
  { label: "GitHub", href: "#" },
  { label: "Twitter / X", href: "#" },
];

export default function Footer() {
  return (
    <footer
      className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 md:gap-0 px-5 md:px-12 py-7 md:py-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="avail-dot w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: "#4ade80" }}
          aria-hidden="true"
        />
        <span className="text-[11px] tracking-[0.04em]" style={{ color: "var(--dim2)" }}>
          Available for projects ·{" "}
          <span style={{ color: "var(--dim)" }}>© 2026 Uthistan</span>
        </span>
      </div>

      <nav aria-label="Social links">
        <ul className="flex gap-6 list-none">
          {SOCIALS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target={href !== "#" ? "_blank" : undefined}
                rel={href !== "#" ? "noopener noreferrer" : undefined}
                className="text-[11px] tracking-[0.04em] transition-colors hover:text-(--ink)"
                style={{ color: "var(--dim2)" }}
                aria-label={label}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
