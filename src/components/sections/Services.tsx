"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { services } from "@/lib/data";
import { GridVis, PhoneVis, CRMVis, SaaSVis, BrowserVis, APIVis } from "./ServiceVisuals";

const VISUALS = [GridVis, PhoneVis, CRMVis, SaaSVis, BrowserVis, APIVis];
const NUMS = ["01", "02", "03", "04", "05", "06"];

function ServiceCard({
  i,
  s,
  Visual,
  progress,
}: {
  i: number;
  s: (typeof services)[number];
  Visual: () => React.ReactElement;
  progress: MotionValue<number>;
}) {
  const targetScale = Math.max(0.85, 1 - (services.length - 1 - i) * 0.03);
  const scale = useTransform(progress, [i / services.length, 1], [1, targetScale]);

  return (
    <div
      className="sticky top-0 flex items-center justify-center px-6 xl:px-12"
      style={{ height: "100vh" }}
    >
      <motion.div
        style={{ scale, top: `${i * 20}px`, position: "relative" }}
        className="w-full max-w-[880px] origin-top"
      >
        <div
          className="flex rounded-[28px] overflow-hidden"
          style={{ background: "var(--bg1)", border: "1px solid var(--border)" }}
        >
          {/* Left: text */}
          <div
            className="flex flex-col justify-between p-10 xl:p-12 relative overflow-hidden"
            style={{ flex: "1 1 0", minHeight: 340 }}
          >
            <span
              aria-hidden="true"
              className="absolute pointer-events-none select-none font-bold leading-none"
              style={{
                fontSize: "clamp(9rem,15vw,14rem)",
                letterSpacing: "-0.08em",
                color: "rgba(201,185,155,.03)",
                bottom: "-0.15em",
                right: "-0.04em",
              }}
            >
              {NUMS[i]}
            </span>

            <div>
              <div
                className="flex items-center gap-2 mb-7 text-[10px] tracking-[0.18em] uppercase"
                style={{ color: "var(--dim2)" }}
              >
                <span
                  className="inline-flex w-5 h-5 border rounded-full items-center justify-center text-[9px]"
                  style={{ borderColor: "var(--b2)" }}
                >
                  {NUMS[i]}
                </span>
                Services
              </div>

              <h3
                className="font-medium leading-[.94] mb-5"
                style={{ fontSize: "clamp(2.2rem,3.2vw,3.6rem)", letterSpacing: "-0.045em" }}
              >
                {s.line1}
                <br />
                <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>
                  {s.line2}
                </em>
              </h3>

              <p className="text-[13px] leading-[1.85] max-w-[340px]" style={{ color: "var(--dim)" }}>
                {s.desc}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap relative z-10">
              {s.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-1 rounded-full tracking-[0.04em]"
                  style={{ border: "1px solid var(--b2)", color: "var(--dim2)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: visual */}
          <div
            className="flex items-center justify-center p-10"
            style={{
              borderLeft: "1px solid var(--border)",
              background: "var(--bg2)",
              minWidth: 260,
            }}
          >
            <Visual />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <>
      {/* ——— MOBILE: simple card list ——— */}
      <div className="md:hidden" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
        <div className="px-5 py-14">
          <div
            className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase mb-10"
            style={{ color: "var(--dim2)" }}
          >
            <span
              className="inline-flex w-5 h-5 border rounded-full items-center justify-center text-[9px]"
              style={{ borderColor: "var(--b2)" }}
            >
              02
            </span>
            Services
          </div>
          {services.map((s, i) => (
            <div key={i} className="py-8" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="text-[10px] tracking-[0.06em] mb-3" style={{ color: "var(--dim2)" }}>
                {NUMS[i]}
              </div>
              <h3
                className="font-medium leading-[.96] mb-4"
                style={{ fontSize: "clamp(1.9rem,7vw,2.8rem)", letterSpacing: "-0.045em" }}
              >
                {s.line1}
                <br />
                <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold)" }}>
                  {s.line2}
                </em>
              </h3>
              <p className="text-[13px] leading-[1.85] mb-5" style={{ color: "var(--dim)" }}>
                {s.desc}
              </p>
              <div className="flex gap-2 flex-wrap">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-1 rounded-full"
                    style={{ border: "1px solid var(--b2)", color: "var(--dim2)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ——— DESKTOP: stacking scroll cards ——— */}
      <div
        ref={container}
        className="hidden md:block"
        style={{
          position: "relative",
          height: `${services.length * 100 + 20}vh`,
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {services.map((s, i) => (
          <ServiceCard key={i} i={i} s={s} Visual={VISUALS[i]} progress={scrollYProgress} />
        ))}
      </div>
    </>
  );
}
