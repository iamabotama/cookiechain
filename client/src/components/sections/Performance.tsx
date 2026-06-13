/*
 * PERFORMANCE SECTION
 * Design: Live particle stream canvas animation — NO static image, NO opacity overlays, NO fades
 * Full vibrancy: ice-blue (0,180,255) + violet (123,47,190) + electric-blue (37,99,235)
 * Mirrors Solana's "fastest growing financial platform" section
 */

import { useEffect, useRef, useState } from "react";
import StreamCanvas from "../StreamCanvas";

const METRICS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    value: "~100.4%",
    label: "Exit backing ratio",
    sub: "Every genesis holder's exit is covered",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#60A5FA" strokeWidth="1.5"/>
        <path d="M10 6v4l3 2" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    value: "6-of-11",
    label: "Multi-sig threshold",
    sub: "Community governance on both chains",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="#7B2FBE" strokeWidth="1.5"/>
        <path d="M7 10h6M10 7v6" stroke="#7B2FBE" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    value: "12,528",
    label: "Genesis wallets honored",
    sub: "Every $GOR holder made whole at launch",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10h14M10 3l7 7-7 7" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    value: "1:1",
    label: "Bridge ratio",
    sub: "No minting, no burning — pure custody transfer",
  },
];

export default function Performance() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#000000",
        overflow: "hidden",
        padding: "6rem 0",
      }}
    >
      {/* Live particle stream animation — full vibrancy, zero overlays */}
      <StreamCanvas
        style={{ zIndex: 1 }}
        maxStreams={14}
        spawnRate={0.018}
      />

      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="flex-col-mobile"
        >
          {/* Left: headline */}
          <div>
            <div className="section-label" style={{ marginBottom: "1rem" }}>Infrastructure</div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                color: "#ffffff",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              }}
            >
              Built to last.<br />
              <span style={{
                background: "linear-gradient(135deg, #7B2FBE 0%, #2563EB 55%, #BAE6FD 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Backed to exit.
              </span>
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "440px",
              marginBottom: "2rem",
              textShadow: "0 1px 8px rgba(0,0,0,0.9)",
            }}>
              Cookie Chain launched with a working product, not a promise. Consistent slot progression, steady validator participation, and a growing dApp ecosystem — every data point points in one direction. The infrastructure was designed for the long term, and the numbers reflect it.
            </p>
            <a
              href="https://app.squads.so/squads/DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx/treasury"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ fontSize: "0.875rem" }}
            >
              View Multi-Sig Treasury ↗
            </a>
          </div>

          {/* Right: metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                style={{
                  background: "rgba(0,0,0,0.72)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease ${0.1 + i * 0.08}s, transform 0.6s ease ${0.1 + i * 0.08}s`,
                }}
              >
                <div style={{ marginBottom: "0.75rem" }}>{m.icon}</div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.25rem",
                }}>
                  {m.value}
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {m.label}
                </div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .flex-col-mobile { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
