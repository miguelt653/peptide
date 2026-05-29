"use client";

export default function CTA() {
  return (
    <section
      style={{
        background: "#0C2D3F",
        padding: "100px clamp(20px, 5vw, 48px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(700px, 100vw)",
          height: 400,
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(224,85,32,0.22) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", maxWidth: 580, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-syne), Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(30px, 4vw, 48px)",
            color: "#fff",
            marginBottom: 18,
            lineHeight: 1.12,
          }}
        >
          Ready to stop reconciling manually?
        </h2>
        <p
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "rgba(255,255,255,0.55)",
            marginBottom: 40,
            lineHeight: 1.65,
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
            letterSpacing: "0.01em",
            transition: "background 0.18s, transform 0.18s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#c84c1c";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
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
