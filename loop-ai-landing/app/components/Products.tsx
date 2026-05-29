"use client";
const balanceFeatures = [
  "Reconciles everything that hits the POS — in-store, online & gift cards",
  "Matches bank deposits against payouts automatically",
  "Posts accurate GL entries straight into your ERP",
  "Covers both 1st party and 3rd party delivery",
  "Supports accrual and cash-based accounting",
  "Eliminates 20+ hours of manual work every month",
];

const chatFeatures = [
  "Natural language queries on all your store data",
  "Generates visual charts instantly — no analyst needed",
  "Covers store performance, errors, platform & revenue",
  "Spot trends by hour, day, location, or channel",
  "Prompt library for common ops & finance questions",
  "Real-time answers without waiting on a report",
];

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="8" fill="rgba(224,85,32,0.15)" />
      <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#E05520" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatDemo() {
  return (
    <div
      style={{
        marginTop: 28,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #1E3552",
        background: "#0F1E30",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          background: "#162840",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #1E3552",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: "#fff",
          }}
        >
          Loop Chat
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {["#E05520", "#8A9BB0", "#8A9BB0"].map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* User */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              background: "#162840",
              color: "#fff",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13,
              padding: "10px 14px",
              borderRadius: "12px 12px 2px 12px",
              maxWidth: "80%",
            }}
          >
            Show me sales by department broken down by hour
          </div>
        </div>
        {/* AI */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div
            style={{
              background: "#fff",
              color: "#0F1E30",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13,
              padding: "10px 14px",
              borderRadius: "12px 12px 12px 2px",
              maxWidth: "85%",
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 600, color: "#E05520" }}>📊 Chart generated.</span> Produce
            peaks 11AM–1PM. Deli peaks 5–7PM. Bakery drives{" "}
            <span style={{ fontWeight: 600 }}>64% of morning revenue</span> before 10AM.
          </div>
        </div>
        {/* User */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              background: "#162840",
              color: "#fff",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13,
              padding: "10px 14px",
              borderRadius: "12px 12px 2px 12px",
              maxWidth: "80%",
            }}
          >
            Which location had the highest error rate this month?
          </div>
        </div>
        {/* AI */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div
            style={{
              background: "#fff",
              color: "#0F1E30",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13,
              padding: "10px 14px",
              borderRadius: "12px 12px 12px 2px",
              maxWidth: "85%",
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 600, color: "#E05520" }}>Store 14 — Westside</span> at{" "}
            <span style={{ fontWeight: 600 }}>4.2% error rate</span>, mostly online order
            discrepancies on weekends.
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  eyebrow,
  title,
  body,
  features,
  extra,
}: {
  eyebrow: string;
  title: string;
  body: string;
  features: string[];
  extra?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderTop: "3px solid #E05520",
        borderRadius: 12,
        padding: "36px 32px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontWeight: 600,
          fontSize: 11,
          color: "#E05520",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {eyebrow}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-syne), Syne, sans-serif",
          fontWeight: 800,
          fontSize: 28,
          color: "#0F1E30",
          margin: "0 0 14px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 15,
          color: "#4A5568",
          lineHeight: 1.65,
          margin: "0 0 24px",
        }}
      >
        {body}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Check />
            <span
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 14,
                color: "#4A5568",
                lineHeight: 1.5,
              }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>
      {extra}
    </div>
  );
}

export default function Products() {
  return (
    <section id="products" style={{ background: "#F7F9FC", padding: "96px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 600,
              fontSize: 12,
              color: "#E05520",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Products
          </div>
          <h2
            style={{
              fontFamily: "var(--font-syne), Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              color: "#0F1E30",
              margin: "0 0 16px",
            }}
          >
            Two tools. Total clarity.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 17,
              color: "#4A5568",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Balance handles the reconciliation so your finance team can stop doing it
            manually. Loop Chat handles the reporting so your ops team stops waiting for it.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
          }}
        >
          <ProductCard
            eyebrow="Reconciliation"
            title="Balance"
            body="Fully automated bookkeeping for every channel that flows through your business."
            features={balanceFeatures}
          />
          <ProductCard
            eyebrow="Reporting & Analytics"
            title="Loop Chat"
            body="An AI chat interface that sits on top of all your store data. Your team asks a question and gets a visual chart back in seconds."
            features={chatFeatures}
            extra={<ChatDemo />}
          />
        </div>
      </div>
    </section>
  );
}
