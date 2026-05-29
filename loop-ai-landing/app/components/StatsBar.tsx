const stats = [
  { value: "20+",      label: "Hours saved on reconciliation every month" },
  { value: "100%",     label: "Of POS transactions reconciled automatically" },
  { value: "1st & 3rd", label: "Party delivery channels covered end to end" },
  { value: "Instant",  label: "Data visibility — no analyst required" },
];

export default function StatsBar() {
  return (
    <section
      style={{
        background: "#F5F7FA",
        borderTop: "1px solid #E2E8F0",
        borderBottom: "1px solid #E2E8F0",
        padding: "56px clamp(20px, 5vw, 48px)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "40px 24px",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              padding: "0 8px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-syne), Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(30px, 4vw, 44px)",
                color: "#E05520",
                lineHeight: 1,
                marginBottom: 10,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 14,
                color: "#4A5568",
                lineHeight: 1.55,
                maxWidth: 170,
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
