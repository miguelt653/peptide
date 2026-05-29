export default function Logo({ height = 40, dark = false }: { height?: number; dark?: boolean }) {
  const iconH = height;
  const iconW = (iconH * 56) / 56;
  const textColor = dark ? "#fff" : "#0C2D3F";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: height * 0.3 }}>
      <svg
        width={iconW}
        height={iconH}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="hexclip">
            {/* Flat-top hexagon */}
            <polygon points="42,4 54,28 42,52 14,52 2,28 14,4" />
          </clipPath>
        </defs>

        {/* Hex fill — slightly lighter than page so it's always visible */}
        <polygon points="42,4 54,28 42,52 14,52 2,28 14,4" fill="#1A4560" />

        <g clipPath="url(#hexclip)">
          {/* Left half — 3 white lines angled like left face of isometric cube */}
          {/* Lines go from upper-right to lower-left (\\\) */}
          {[20, 27, 34].map((x, i) => (
            <line
              key={i}
              x1={x + 8}
              y1={2}
              x2={x - 8}
              y2={54}
              stroke="white"
              strokeWidth="5.5"
              strokeLinecap="butt"
              opacity="0.95"
            />
          ))}

          {/* Divider — subtle vertical center line */}
          <line x1="30" y1="4" x2="30" y2="52" stroke="#0C2D3F" strokeWidth="1.5" opacity="0.4" />

          {/* Right half — 3 orange vertical bars */}
          <rect x="31" y="12" width="6.5" height="40" rx="1" fill="#E05520" />
          <rect x="40" y="17" width="6.5" height="35" rx="1" fill="#E05520" />
          <rect x="49" y="22" width="6.5" height="30" rx="1" fill="#E05520" />
        </g>

        {/* Hex border */}
        <polygon
          points="42,4 54,28 42,52 14,52 2,28 14,4"
          fill="none"
          stroke={dark ? "rgba(255,255,255,0.15)" : "rgba(12,45,63,0.2)"}
          strokeWidth="1.5"
        />
      </svg>

      <span
        style={{
          fontFamily: "var(--font-syne), Syne, sans-serif",
          fontWeight: 800,
          fontSize: height * 0.5,
          letterSpacing: "0.05em",
          lineHeight: 1,
          color: textColor,
        }}
      >
        LOOP AI
      </span>
    </div>
  );
}
