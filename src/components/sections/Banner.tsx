const ITEMS = [
  "Let's Build Something Real", "Full-Stack Engineer",
  "Bengaluru, India", "Available for Projects",
];

export default function Banner() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} aria-hidden="true">
      <div className="flex whitespace-nowrap banner-anim py-5">
        {doubled.map((item, i) => (
          <span key={i} className="flex-shrink-0 font-medium leading-none" style={{ fontSize: "clamp(2rem,4vw,3.6rem)", letterSpacing: "-0.035em", padding: "0 36px" }}>
            {item}
            {i < doubled.length - 1 && (
              <span className="mx-4 align-middle" style={{ color: "var(--gold)", fontSize: "clamp(1rem,2vw,1.8rem)" }}>✦</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
