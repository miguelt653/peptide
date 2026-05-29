"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px, 5vw, 48px)",
        transition: "background 0.25s, box-shadow 0.25s",
        background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.08)" : "none",
      }}
    >
      <Logo height={36} dark={!scrolled} />
      <a
        href="https://tryloop.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{
          background: "#E05520",
          color: "#fff",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontWeight: 600,
          fontSize: 14,
          padding: "10px 22px",
          borderRadius: 7,
          textDecoration: "none",
          letterSpacing: "0.01em",
          transition: "background 0.18s, transform 0.18s",
          display: "inline-block",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "#c84c1c";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "#E05520";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Book a Demo
      </a>
    </nav>
  );
}
