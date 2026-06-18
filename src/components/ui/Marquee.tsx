interface MarqueeProps {
  items: string[];
  direction?: "fwd" | "rev";
  className?: string;
}

export default function Marquee({ items, direction = "fwd", className = "" }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className={`overflow-hidden border-b py-4 ${className}`} style={{ borderColor: "var(--border)", background: "var(--bg)" }} aria-hidden="true">
      <div className={`flex whitespace-nowrap ${direction === "fwd" ? "marquee-fwd" : "marquee-rev"}`}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-7 px-7 text-[10px] tracking-[0.14em] uppercase"
            style={{ color: "var(--dim2)" }}
          >
            {item}
            {i < doubled.length - 1 && (
              <span className="w-[3px] h-[3px] rounded-full opacity-40 flex-shrink-0" style={{ background: "var(--dim2)" }} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
