/*
 * HERO SECTION — v2
 * Design: Pure black + violet/electric-blue/ice ribbons (right side)
 * Headline: longevity / persistence / maturity messaging
 * Logo: actual cookie sticker logo with subtle blue glow
 */

import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663273809872/J3hDDZc9FEamYFSB95Wtww/cc-hero-v3-fycfSqHn94rbr25XpikzPM.webp";

const CHAIN_STATS = [
  { label: "Current Slot", value: "5,570,342", live: true },
  { label: "Block Height", value: "5,529,536", live: false },
  { label: "TPS", value: "10", live: true },
  { label: "Avg Fee / TX", value: "0.000005 COOK", live: false },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="overview"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#000000",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background ribbon image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
      }} />

      {/* Left gradient fade for text readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 38%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)",
      }} />

      {/* Top vignette */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "120px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
      }} />

      {/* Bottom gradient for stat bar */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "200px",
        background: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)",
      }} />

      {/* Subtle violet glow behind text */}
      <div style={{
        position: "absolute",
        left: "-10%",
        top: "20%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(ellipse, rgba(123,47,190,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Main content */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: "8rem",
          paddingBottom: "6rem",
          maxWidth: "680px",
        }}
      >
        {/* Label */}
        <div className="section-label" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          marginBottom: "1.5rem",
        }}>
          Community SVM · Launched May 26, 2026
        </div>

        {/* Headline — longevity / persistence messaging */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(2.75rem, 6vw, 5rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          color: "#ffffff",
          marginBottom: "1.5rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
        }}>
          The community chain<br />
          <span style={{
            background: "linear-gradient(135deg, #7B2FBE 0%, #2563EB 50%, #BAE6FD 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            built to last.
          </span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1.125rem",
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.62)",
          marginBottom: "2.5rem",
          maxWidth: "520px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
        }}>
          A high-performance SVM Layer 1 built by the community that chose to stay. Fixed 1B supply. ~100.4% equity-backed bridge. 6-of-11 multi-sig governance. Every metric trending forward — no pivots, no resets, no signs of stopping.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
        }}>
          <a
            href="#tokenomics"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#tokenomics")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-primary"
          >
            View Tokenomics
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="/whitepaper"
            className="btn-outline"
          >
            Read Whitepaper
          </a>
        </div>

        {/* Token address */}
        <div style={{
          marginTop: "2rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.4s",
        }}>
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginRight: "0.5rem" }}>
            Solana CA (sCOOK):
          </span>
          <code className="address-mono" style={{ fontSize: "0.7rem" }}>
            {LINKS.ca_solana}
          </code>
        </div>
      </div>

      {/* Chain stat bar */}
      <div style={{
        position: "relative",
        zIndex: 10,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(12px)",
      }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          }}>
            {CHAIN_STATS.map((stat, i) => (
              <div key={stat.label} style={{
                padding: "1.25rem 0",
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                paddingLeft: i > 0 ? "1.5rem" : "0",
                paddingRight: "1.5rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                  {stat.live && (
                    <span style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#60A5FA",
                      display: "inline-block",
                      boxShadow: "0 0 6px #60A5FA",
                      animation: "pulse 2s infinite",
                    }} />
                  )}
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#ffffff",
                  }}>
                    {stat.value}
                  </span>
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.4)",
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </section>
  );
}
