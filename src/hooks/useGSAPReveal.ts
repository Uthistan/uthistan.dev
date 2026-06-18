"use client";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export function useGSAPReveal<T extends HTMLElement>(
  className = ".reveal"
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(className).forEach((el) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: "power3.out",
          });
        });
      }, ref.current ?? undefined);
    };

    init();
    return () => ctx?.revert();
  }, [className]);

  return ref;
}
