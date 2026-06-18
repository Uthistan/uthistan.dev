"use client";
import { useEffect, useRef, useState } from "react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 2 + Math.random() * 5);
        if (next >= 100) clearInterval(iv);
        return next;
      });
    }, 40);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const animate = async () => {
      const { gsap } = await import("gsap");
      const tl = gsap.timeline();
      if (spanRef.current)
        tl.to(spanRef.current, { y: "0%", duration: 0.85, ease: "power4.out" });
      if (loaderRef.current)
        tl.to(loaderRef.current, {
          yPercent: -100, duration: 0.8, ease: "power3.inOut", delay: 0.9, onComplete,
        });
    };
    animate();
  }, [progress, onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[8000] flex flex-col items-center justify-center gap-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="overflow-hidden text-[clamp(3rem,9vw,8rem)] font-medium tracking-[-0.06em] leading-none">
        <span ref={spanRef} className="block translate-y-full">
          Uthistan.
        </span>
      </div>
      <div className="w-40 h-px" style={{ background: "var(--b2)" }}>
        <div
          className="h-full transition-[width_.05s_linear]"
          style={{ width: `${progress}%`, background: "var(--gold)" }}
        />
      </div>
      <div className="text-[10px] tracking-[0.16em] uppercase" style={{ color: "var(--dim2)" }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}
