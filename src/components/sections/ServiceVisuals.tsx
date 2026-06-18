export function GridVis() {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(6,1fr)", width: 280, height: 280 }}>
      {Array.from({ length: 36 }).map((_, i) => (
        <span
          key={i}
          className="border rounded-sm"
          style={{
            borderColor: "rgba(201,185,155,.1)",
            animation: `glow 3s ease-in-out infinite`,
            animationDelay: `${(i % 3) * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

export function PhoneVis() {
  return (
    <div className="relative overflow-hidden rounded-[26px]" style={{ width: 130, height: 250, border: "2px solid rgba(201,185,155,.2)" }}>
      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-9 h-1 rounded-sm" style={{ background: "rgba(201,185,155,.2)" }} />
      <div className="absolute rounded-2xl overflow-hidden" style={{ inset: "22px 7px 7px", background: "rgba(201,185,155,.04)" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-px mx-3 mt-5" style={{ background: "rgba(201,185,155,.12)", width: i === 1 ? "60%" : i === 2 ? "80%" : "100%", animation: `fl 2s ease-in-out infinite alternate`, animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>
    </div>
  );
}

export function CRMVis() {
  const nodes = [
    { label: "CRM", style: { top: "15%", left: "5%" } },
    { label: "Lead", style: { top: "5%", left: "42%" } },
    { label: "Deal", style: { top: "15%", right: "5%" } },
    { label: "Report", style: { bottom: "15%", left: "20%" } },
    { label: "Email", style: { bottom: "15%", right: "20%" } },
  ];
  return (
    <div className="relative" style={{ width: 300, height: 260 }}>
      {nodes.map((n, i) => (
        <div key={i} className="absolute w-[52px] h-[52px] rounded-full flex items-center justify-center text-[8px] tracking-[0.08em] uppercase" style={{ border: "1px solid rgba(201,185,155,.18)", color: "rgba(201,185,155,.4)", animation: `np 3s ease-in-out infinite alternate`, animationDelay: `${i * 0.15}s`, ...n.style }}>
          {n.label}
        </div>
      ))}
    </div>
  );
}

export function SaaSVis() {
  const bars = [
    { label: "Revenue", pct: 82, delay: 0 },
    { label: "Users", pct: 64, delay: 0.2 },
    { label: "Churn", pct: 18, delay: 0.4 },
    { label: "MRR", pct: 91, delay: 0.6 },
  ];
  return (
    <div style={{ width: 280 }}>
      {bars.map((b) => (
        <div key={b.label} className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.08em] uppercase flex-shrink-0" style={{ color: "var(--dim2)", width: 52 }}>{b.label}</span>
          <div className="flex-1 h-1 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
            <div className="h-full rounded-sm" style={{ width: `${b.pct}%`, background: "linear-gradient(90deg,rgba(201,185,155,.3),rgba(201,185,155,.8))", animation: `bf 2.5s ease-in-out infinite alternate`, animationDelay: `${b.delay}s` }} />
          </div>
        </div>
      ))}
      <div className="flex justify-between mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
        {[["$24k", "MRR"], ["1.2k", "Users"], ["98%", "Uptime"]].map(([v, l]) => (
          <div key={l}>
            <div className="font-medium tracking-[-0.04em]" style={{ fontSize: "clamp(1.4rem,3vw,2.2rem)", color: "var(--gold)" }}>{v}</div>
            <div className="text-[9px] tracking-[0.08em] uppercase mt-1" style={{ color: "var(--dim2)" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BrowserVis() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ width: 300, border: "1px solid rgba(201,185,155,.13)" }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        {[["#ff5f57"], ["#febc2e"], ["#28c840"]].map(([c]) => (
          <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
        ))}
        <div className="flex-1 h-4 rounded mx-2 flex items-center px-2 text-[8px]" style={{ background: "rgba(255,255,255,.06)", color: "rgba(201,185,155,.4)" }}>uthistan.dev</div>
      </div>
      <div className="p-5" style={{ background: "var(--bg2)", minHeight: 180 }}>
        <div className="h-[6px] rounded-sm mb-4" style={{ background: "rgba(201,185,155,.14)", animation: "bk 2s ease-in-out infinite" }} />
        {[100, 70, 85, 55].map((w, i) => (
          <div key={i} className="h-[3px] rounded-sm mb-3" style={{ width: `${w}%`, background: "rgba(255,255,255,.07)", animation: "bk 2s ease-in-out infinite alternate", animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

export function APIVis() {
  return (
    <div className="relative" style={{ width: 280, height: 220 }}>
      {[
        { label: "Stripe", cls: "top-[8%] left-[2%]" },
        { label: "Slack", cls: "top-[8%] right-[2%]" },
        { label: "Notion", cls: "bottom-[8%] left-[2%]" },
        { label: "Gmail", cls: "bottom-[8%] right-[2%]" },
      ].map((n) => (
        <div key={n.label} className={`absolute px-3 py-2 rounded-md text-[9px] tracking-[0.08em] uppercase ${n.cls}`} style={{ border: "1px solid rgba(201,185,155,.16)", color: "rgba(201,185,155,.45)" }}>
          {n.label}
        </div>
      ))}
      <div className="absolute px-3 py-2 rounded-md text-[9px] tracking-[0.08em] uppercase top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ border: "1px solid rgba(201,185,155,.45)", color: "rgba(201,185,155,.9)", background: "rgba(201,185,155,.05)", animation: "ag 2.5s ease-in-out infinite" }}>
        API Hub
      </div>
    </div>
  );
}
