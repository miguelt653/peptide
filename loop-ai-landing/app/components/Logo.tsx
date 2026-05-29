export default function Logo({ height = 40, dark = false }: { height?: number; dark?: boolean }) {
  // Flat-top hexagon icon matching Loop AI branding
  // ViewBox 60x56, flat-top hex
  const iconH = height;
  const iconW = (iconH * 60) / 56;

  const textColor = dark ? "#fff" : "#0C2D3F";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: height * 0.28 }}>
      <svg
        width={iconW}
        height={iconH}
        viewBox="0 0 60 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="hexclip">
            {/* Flat-top hexagon */}
            <polygon points="45,3 57,28 45,53 15,53 3,28 15,3" />
          </clipPath>
        </defs>

        {/* Hex background — dark teal */}
        <polygon points="45,3 57,28 45,53 15,53 3,28 15,3" fill="#0C2D3F" />

        {/* All inner artwork clipped to hex */}
        <g clipPath="url(#hexclip)">
          {/* Left half — 3 white diagonal lines (left face of cube, receding) */}
          {/* Lines angle follows left face edge direction: roughly -30deg */}
          {[16, 22, 28].map((x, i) => (
            <line
              key={i}
              x1={x - 12}
              y1={2}
              x2={x + 12}
              y2={54}
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.92"
            />
          ))}

          {/* Right half — 3 orange vertical bars */}
          <rect x="33" y="10" width="7" height="43" rx="1" fill="#E05520" />
          <rect x="43" y="14" width="7" height="39" rx="1" fill="#E05520" />
          <rect x="53" y="18" width="7" height="35" rx="1" fill="#E05520" />
        </g>

        {/* Subtle hex border */}
        <polygon
          points="45,3 57,28 45,53 15,53 3,28 15,3"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      </svg>

      <span
        style={{
          fontFamily: "var(--font-syne), Syne, sans-serif",
          fontWeight: 800,
          fontSize: height * 0.52,
          letterSpacing: "0.04em",
          lineHeight: 1,
          color: textColor,
        }}
      >
        LOOP AI
      </span>
    </div>
  );
}
