export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 px-5 md:px-12 py-6 md:py-7" style={{ borderTop: "1px solid var(--border)" }}>
      <span className="text-[11px]" style={{ color: "var(--dim2)" }}>© 2026 Uthistan. All rights reserved.</span>
      <div className="flex gap-6">
        {["LinkedIn", "GitHub", "Twitter / X"].map((l) => (
          <a key={l} href="#" className="text-[11px] transition-colors hover:text-[var(--ink)]" style={{ color: "var(--dim2)" }}>{l}</a>
        ))}
      </div>
    </footer>
  );
}
