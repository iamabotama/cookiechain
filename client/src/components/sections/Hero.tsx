/*
 * HERO SECTION
 * Design: Full-bleed black hero with amber/mint/purple 3D ribbon right side
 * Left: Large bold white display type, subtext, two CTAs
 * Bottom: Chain stat bar
 * Mirrors Solana hero structure
 */

import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663273809872/J3hDDZc9FEamYFSB95Wtww/cookiechain-hero-bg-9ChBGnoAZ5JWfiw5ZsKkxN.webp";

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
        background: "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 45%, rgba(0,0,0,0.3) 70%, transparent 100%)",
      }} />

      {/* Bottom gradient for stat bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "200px",
        background: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)",
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
          maxWidth: "640px",
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

        {/* Headline */}
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
            background: "linear-gradient(135deg, #F5A623 0%, #14F195 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            that stayed.
          </span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1.125rem",
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.65)",
          marginBottom: "2.5rem",
          maxWidth: "520px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
        }}>
          Cookie Chain is a high-performance, community-operated SVM Layer 1 blockchain.
          Fixed 1B supply. ~100.4% backed equity bridge. 6-of-11 multi-sig governance.
          Built by the people who rescued a broken chain and built something better.
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
            className="btn-amber"
          >
            View Tokenomics
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href={LINKS.whitepaper}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Read Whitepaper ↗
          </a>
        </div>

        {/* Token address */}
        <div style={{
          marginTop: "2rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.4s",
        }}>
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginRight: "0.5rem" }}>
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
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(10px)",
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
                      background: "#14F195",
                      display: "inline-block",
                      boxShadow: "0 0 6px #14F195",
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
                  color: "rgba(255,255,255,0.45)",
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
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
