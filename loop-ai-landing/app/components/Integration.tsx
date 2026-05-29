const flowItems = [
  { label: "POS System", sub: "In-store, online orders & gift cards", icon: "🏪" },
  { label: "Bank", sub: "Deposits, payouts & settlements", icon: "🏦" },
  { label: "3rd Party Delivery", sub: "DoorDash, Uber Eats, Grubhub & more", icon: "🛵" },
  { label: "Payroll", sub: "Labor data & cost reconciliation", icon: "👥" },
];

const tags1 = ["1st Party", "3rd Party Delivery", "In-Store", "Online Orders", "Gift Cards", "Payroll"];
const tags2 = ["NetSuite", "QuickBooks", "Xero"];

function Arrow() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3v14M10 17l-4-4M10 17l4-4" stroke="#8A9BB0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function Integration() {
  return (
    <section style={{ background: "#0F1E30", padding: "96px 24px" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Flow diagram */}
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          {flowItems.map((item, i) => (
            <div key={item.label}>
              <div
                style={{
                  background: "#162840",
                  border: "1px solid #1E3552",
                  borderRadius: 10,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#fff",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      fontSize: 12,
                      color: "#8A9BB0",
                      marginTop: 2,
                    }}
                  >
                    {item.sub}
                  </div>
                </div>
              </div>
              {i < flowItems.length - 1 && <Arrow />}
            </div>
          ))}

          <Arrow />

          {/* Balance engine */}
          <div
            style={{
              background: "#E05520",
              borderRadius: 10,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 22 }}>⚙️</span>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-syne), Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#fff",
                }}
              >
                Loop AI Balance Engine
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.75)",
                  marginTop: 2,
                }}
              >
                Automated reconciliation & GL posting
              </div>
            </div>
          </div>

          <Arrow />

          {/* ERP */}
          <div
            style={{
              background: "rgba(224,85,32,0.08)",
              border: "1px solid rgba(224,85,32,0.3)",
              borderRadius: 10,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 22 }}>📊</span>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                Your ERP System
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 12,
                  color: "#8A9BB0",
                  marginTop: 2,
                }}
              >
                NetSuite, QuickBooks, Xero & more
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 600,
              fontSize: 12,
              color: "#E05520",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Seamless Integration
          </div>
          <h2
            style={{
              fontFamily: "var(--font-syne), Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              color: "#fff",
              lineHeight: 1.15,
              margin: "0 0 20px",
            }}
          >
            All your data.{" "}
            <span style={{ color: "#E05520" }}>One clean source of truth.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 16,
              fontWeight: 300,
              color: "#8A9BB0",
              lineHeight: 1.7,
              margin: "0 0 32px",
            }}
          >
            Loop AI connects to your POS, bank, 3rd party platforms and payroll —
            reconciles everything and posts clean GL entries straight into your ERP.
            Nothing manual. Nothing falling through the cracks.
          </p>

          {/* Tags row 1 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            {tags1.map((t) => (
              <span
                key={t}
                style={{
                  background: "rgba(224,85,32,0.15)",
                  border: "1px solid rgba(224,85,32,0.3)",
                  color: "#E05520",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "5px 12px",
                  borderRadius: 100,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {/* Tags row 2 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tags2.map((t) => (
              <span
                key={t}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid #1E3552",
                  color: "#8A9BB0",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "5px 12px",
                  borderRadius: 100,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
