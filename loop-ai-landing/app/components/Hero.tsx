"use client";
export default function Hero() {
  return (
    <section
      style={{
        background: "#0F1E30",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 24px 80px",
      }}
    >
      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Orange radial glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 400,
          background: "radial-gradient(ellipse at center, rgba(224,85,32,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", maxWidth: 760 }}>
        {/* Badge */}
        <div className="fade-up" style={{ display: "inline-block", marginBottom: 24 }}>
          <span
            style={{
              background: "rgba(224,85,32,0.15)",
              border: "1px solid rgba(224,85,32,0.35)",
              color: "#E05520",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 500,
              fontSize: 13,
              padding: "6px 16px",
              borderRadius: 100,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Financial Automation Platform
          </span>
        </div>

        {/* H1 */}
        <h1
          className="fade-up fade-up-1"
          style={{
            fontFamily: "var(--font-syne), Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.1,
            color: "#fff",
            margin: "0 0 24px",
          }}
        >
          Stop Reconciling.{" "}
          <span style={{ color: "#E05520" }}>Start Deciding.</span>
        </h1>

        {/* Subtext */}
        <p
          className="fade-up fade-up-2"
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "clamp(16px, 2vw, 19px)",
            fontWeight: 300,
            color: "#8A9BB0",
            lineHeight: 1.65,
            maxWidth: 580,
            margin: "0 auto 40px",
          }}
        >
          Loop AI automates your entire reconciliation process and gives your team
          instant access to the data they need — without combing through spreadsheets.
        </p>

        {/* CTAs */}
        <div
          className="fade-up fade-up-3"
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
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
            Book a Demo
          </a>
          <a
            href="#products"
            style={{
              background: "transparent",
              color: "#fff",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 500,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 8,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.25)",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
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
