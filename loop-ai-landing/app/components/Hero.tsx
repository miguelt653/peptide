"use client";

export default function Hero() {
  return (
    <section
      style={{
        background: "#0C2D3F",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "128px clamp(20px, 5vw, 48px) 96px",
      }}
    >
      {/* Subtle grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />
      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(800px, 100vw)",
          height: 480,
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(224,85,32,0.22) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          textAlign: "center",
          maxWidth: 780,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Badge */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(224,85,32,0.12)",
              border: "1px solid rgba(224,85,32,0.3)",
              color: "#E05520",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 600,
              fontSize: 12,
              padding: "6px 18px",
              borderRadius: 100,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Financial Automation Platform
          </span>
        </div>

        {/* H1 */}
        <h1
          className="fade-up delay-1"
          style={{
            fontFamily: "var(--font-syne), Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(38px, 6.5vw, 76px)",
            lineHeight: 1.08,
            color: "#fff",
            marginBottom: 24,
          }}
        >
          Stop Reconciling.{" "}
          <br />
          <span style={{ color: "#E05520" }}>Start Deciding.</span>
        </h1>

        {/* Subtext */}
        <p
          className="fade-up delay-2"
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "clamp(16px, 2.2vw, 20px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 44px",
          }}
        >
          Loop AI automates your entire reconciliation process and gives your
          team instant access to the data they need — without combing through
          spreadsheets.
        </p>

        {/* CTAs */}
        <div
          className="fade-up delay-3"
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://tryloop.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#E05520",
              color: "#fff",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "background 0.18s, transform 0.18s",
              letterSpacing: "0.01em",
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
            Book a Demo
          </a>
          <a
            href="#products"
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 500,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 8,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "border-color 0.18s, background 0.18s",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
