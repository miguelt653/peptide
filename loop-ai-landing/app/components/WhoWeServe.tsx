"use client";
const personas = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="rgba(224,85,32,0.1)" />
        <path d="M8 22V12l8-4 8 4v10" stroke="#E05520" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="13" y="16" width="6" height="6" rx="1" stroke="#E05520" strokeWidth="1.5" />
      </svg>
    ),
    title: "Finance & Accounting",
    body: "Eliminate month-end reconciliation work. Get clean GL entries automatically and a single source of truth for every transaction.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="rgba(224,85,32,0.1)" />
        <circle cx="16" cy="13" r="4" stroke="#E05520" strokeWidth="1.5" />
        <path d="M8 24c0-4 3.6-7 8-7s8 3 8 7" stroke="#E05520" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Operations",
    body: "Get instant visibility into store performance without waiting on a report. Loop Chat gives your team answers in seconds.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="rgba(224,85,32,0.1)" />
        <rect x="9" y="9" width="14" height="14" rx="2" stroke="#E05520" strokeWidth="1.5" />
        <path d="M13 16h6M16 13v6" stroke="#E05520" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "IT & Technology",
    body: "Replace fragile manual pipelines with an automated layer connecting your POS, bank, delivery platforms and ERP reliably.",
  },
];

export default function WhoWeServe() {
  return (
    <section style={{ background: "#fff", padding: "96px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-syne), Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(26px, 3vw, 40px)",
            color: "#0F1E30",
            textAlign: "center",
            margin: "0 0 56px",
          }}
        >
          Built for every leader who touches the numbers.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {personas.map((p) => (
            <div
              key={p.title}
              style={{
                background: "#F7F9FC",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "32px 28px",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ marginBottom: 18 }}>{p.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-syne), Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#0F1E30",
                  margin: "0 0 12px",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 14,
                  color: "#4A5568",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
