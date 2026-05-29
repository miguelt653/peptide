import Logo from "./Logo";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#fff",
        borderTop: "1px solid #E2E8F0",
        padding: "28px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <Logo size={28} />
      <p
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 13,
          color: "#8A9BB0",
          margin: 0,
        }}
      >
        tryloop.ai · Automated Reconciliation &amp; AI Reporting
      </p>
    </footer>
  );
}
