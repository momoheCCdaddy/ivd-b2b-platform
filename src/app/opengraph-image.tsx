import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cobioer BioSciences — IVD reference materials and cell models";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #071b2c 0%, #0b4660 58%, #0a8aa5 100%)",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px 84px",
        position: "relative",
        width: "100%",
      }}
    >
      <div style={{ border: "1px solid rgba(255,255,255,.18)", borderRadius: 36, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "58px 64px", width: "100%" }}>
        <div style={{ alignItems: "center", display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: "0.08em" }}>
          <div style={{ background: "#35c8d0", borderRadius: 12, height: 28, marginRight: 16, width: 28 }} />
          COBIOER BIOSCIENCES
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#7ee7ec", fontSize: 22, fontWeight: 700, letterSpacing: "0.16em", marginBottom: 22 }}>GLOBAL LIFE-SCIENCE CATALOG</div>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.08, maxWidth: 930 }}>IVD Reference Materials &amp; Authenticated Cell Models</div>
          <div style={{ color: "#c8e4eb", fontSize: 27, marginTop: 26 }}>7,000+ catalog products · Technical support · Global inquiries</div>
        </div>
      </div>
    </div>,
    size,
  );
}
