export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagonal cube outline */}
        <polygon
          points="18,2 32,10 32,26 18,34 4,26 4,10"
          fill="#0F1E30"
          stroke="#1E3552"
          strokeWidth="1"
        />
        {/* Bar chart — 3 ascending bars in orange */}
        <rect x="10" y="22" width="4" height="6" rx="0.5" fill="#E05520" />
        <rect x="16" y="18" width="4" height="10" rx="0.5" fill="#E05520" />
        <rect x="22" y="14" width="4" height="14" rx="0.5" fill="#E05520" />
      </svg>
      <span style={{ fontFamily: "var(--font-syne), Syne, sans-serif", fontWeight: 800 }}>
        <span style={{ color: "#0F1E30" }}>LOOP</span>
        <span style={{ color: "#E05520" }}>AI</span>
      </span>
    </div>
  );
}
