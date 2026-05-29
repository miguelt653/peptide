"use client";
export default function CTA() {
  return (
    <section
      style={{
        background: "#0F1E30",
        padding: "96px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orange glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 320,
          background: "radial-gradient(ellipse at center, rgba(224,85,32,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-syne), Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 3.5vw, 44px)",
            color: "#fff",
            margin: "0 0 16px",
            lineHeight: 1.15,
          }}
        >
          Ready to stop reconciling manually?
        </h2>
        <p
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 17,
            color: "#8A9BB0",
            margin: "0 0 36px",
            lineHeight: 1.6,
          }}
        >
          See how Loop AI can save your team 20+ hours every month.
        </p>
        <a
          href="https://tryloop.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#E05520",
            color: "#fff",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            padding: "15px 36px",
            borderRadius: 8,
            textDecoration: "none",
            transition: "background 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#c44a1a";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#E05520";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Book a Demo at tryloop.ai
        </a>
      </div>
    </section>
  );
}
