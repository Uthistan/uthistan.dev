import { ImageResponse } from "next/og";
import { SITE_TITLE, SITE_TAGLINE } from "@/lib/site";

export const alt = SITE_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#080808",
        color: "#eeebe6",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, letterSpacing: 2, color: "#c9b99b" }}>
        Full-Stack Engineer
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 700, letterSpacing: -4 }}>
          Uthistan
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 40, color: "#c9b99b" }}>
          {SITE_TAGLINE}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 28, color: "#777" }}>uthistan.com</div>
    </div>,
    size,
  );
}
