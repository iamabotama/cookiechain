/*
 * ROADMAP SECTION
 * Design: Vertical timeline with amber/mint/purple phase markers
 * Data from whitepaper v2.0 roadmap section
 */

import { useEffect, useRef, useState } from "react";

const PHASES = [
  {
    phase: "Phase 0",
    title: "Genesis & Launch",
    status: "complete",
    color: "#14F195",
    items: [
      "Gorbagana snapshot captured (12,528 wallets)",
      "Cookie Chain SVM mainnet launched May 26, 2026",
      "sCOOK deployed on Solana (CA: 36ZrtQoab5...)",
      "Equity bridge operational (6-of-11 multi-sig)",
      "CookieScan block explorer live",
      "Genesis airdrop distributed",
    ],
  },
  {
    phase: "Phase 1",
    title: "Ecosystem Foundation",
    status: "active",
    color: "#F5A623",
    items: [
      "Cookoven staking platform deployment",
      "CookieSwap DEX launch",
      "BakedBazaar NFT marketplace",
      "Validator onboarding program",
      "Expanded signer transparency",
      "Community governance proposals",
    ],
  },
  {
    phase: "Phase 2",
    title: "Bridge Evolution",
    status: "upcoming",
    color: "#9945FF",
    items: [
      "Hyperlane Warp Routes integration (burn/mint)",
      "Removal of equity reserve dependency",
      "Trustless cross-chain transfers",
      "Additional chain bridge support",
      "Expanded multi-sig signer pool",
    ],
  },
  {
    phase: "Phase 3",
    title: "Full Decentralization",
    status: "future",
    color: "#444444",
    items: [
      "Broader DAO governance structure",
      "On-chain proposal and voting system",
      "Ecosystem grants program",
      "Developer tooling and SDK",
      "Institutional integrations",
    ],
  },
];

const STATUS_LABELS: Record<string, string> = {
  complete: "COMPLETE",
  active: "IN PROGRESS",
  upcoming: "UPCOMING",
  future: "FUTURE",
};

export default function Roadmap() {
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
      style={{ background: "#000000", padding: "6rem 0" }}
      ref={ref}
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            marginBottom: "4rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="section-label" style={{ marginBottom: "1rem" }}>Roadmap</div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: "1rem",
            }}
          >
            Where we're going.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", maxWidth: "520px", lineHeight: 1.65 }}>
            Cookie Chain launched with a working product, not a promise. The roadmap builds on
            a foundation that already exists — every phase listed here has a clear technical path.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {PHASES.map((phase, i) => (
            <div
              key={phase.phase}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1px 1fr",
                gap: "0 2rem",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${0.1 + i * 0.12}s, transform 0.6s ease ${0.1 + i * 0.12}s`,
              }}
              className="roadmap-row"
            >
              {/* Phase label */}
              <div style={{ paddingTop: "1.5rem", paddingBottom: "2.5rem", textAlign: "right" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: phase.color,
                  letterSpacing: "0.08em",
                  marginBottom: "0.25rem",
                }}>
                  {phase.phase}
                </div>
                <div style={{
                  display: "inline-block",
                  padding: "0.15rem 0.5rem",
                  background: `${phase.color}18`,
                  border: `1px solid ${phase.color}30`,
                  borderRadius: "0.25rem",
                  fontSize: "0.6rem",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  color: phase.color,
                  letterSpacing: "0.08em",
                }}>
                  {STATUS_LABELS[phase.status]}
                </div>
              </div>

              {/* Timeline line + dot */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: phase.color,
                  marginTop: "1.75rem",
                  flexShrink: 0,
                  boxShadow: phase.status === "active" ? `0 0 12px ${phase.color}` : "none",
                  zIndex: 1,
                }} />
                {i < PHASES.length - 1 && (
                  <div style={{
                    flex: 1,
                    width: "1px",
                    background: `linear-gradient(to bottom, ${phase.color}60, ${PHASES[i+1].color}30)`,
                    marginTop: "4px",
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingTop: "1.25rem", paddingBottom: "2.5rem" }}>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#ffffff",
                  marginBottom: "1rem",
                  letterSpacing: "-0.02em",
                }}>
                  {phase.title}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {phase.items.map((item) => (
                    <div
                      key={item}
                      style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}
                    >
                      <div style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: phase.status === "complete" ? "#14F195" : phase.color,
                        marginTop: "0.45rem",
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: "0.875rem",
                        color: phase.status === "future" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.65)",
                        lineHeight: 1.5,
                      }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .roadmap-row { grid-template-columns: 80px 1px 1fr !important; gap: 0 1rem !important; }
        }
      `}</style>
    </section>
  );
}
