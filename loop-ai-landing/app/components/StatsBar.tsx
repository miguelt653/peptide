const stats = [
  { value: "20+", label: "Hours saved on reconciliation every month" },
  { value: "100%", label: "Of POS transactions reconciled automatically" },
  { value: "1st & 3rd", label: "Party delivery channels covered end to end" },
  { value: "Instant", label: "Data visibility — no analyst required" },
];

export default function StatsBar() {
  return (
    <section
      style={{
        background: "#F7F9FC",
        borderTop: "1px solid #E2E8F0",
        borderBottom: "1px solid #E2E8F0",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "32px 16px",
        }}
      >
        {stats.map((s) => (
          <div key={s.value} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-syne), Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 3.5vw, 40px)",
                color: "#E05520",
                marginBottom: 8,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 14,
                color: "#4A5568",
                lineHeight: 1.5,
                maxWidth: 180,
                margin: "0 auto",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
