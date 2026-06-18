"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
    };
    document.addEventListener("mousemove", onMove, { passive: true });

    let raf: number;
    const loop = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const addHov = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, .proj-row, .faq-q, .ct-link")) {
        document.body.classList.add("cursor-hover");
      }
    };
    const remHov = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, .proj-row, .faq-q, .ct-link")) {
        document.body.classList.remove("cursor-hover");
      }
    };
    document.body.addEventListener("mouseenter", addHov, true);
    document.body.addEventListener("mouseleave", remHov, true);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.removeEventListener("mouseenter", addHov, true);
      document.body.removeEventListener("mouseleave", remHov, true);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
