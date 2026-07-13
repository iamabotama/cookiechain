/*
 * ROADMAP SECTION — theme-aware
 * All colors via CSS variables (--cook-*) for automatic light/dark switching
 */

import { useEffect, useRef, useState } from "react";

const PHASES: {
  phase: string; title: string; status: string; color: string; period?: string;
  items: { t: string; done: boolean; date?: string }[];
}[] = [
  {
    phase: "Phase 0",
    title: "Genesis & Launch",
    period: "May 2026",
    status: "complete",
    color: "#60A5FA",
    items: [
      { t: "Genesis snapshot: 279,862,165.78 cCOOK distributed to legacy holders", done: true, date: "snapshot May 3 · distributed May 26, 2026" },
      { t: "Cookie Chain SVM mainnet launched", done: true, date: "May 26, 2026" },
      { t: "sCOOK deployed on Solana (CA: 36ZrtQoab5...)", done: true, date: "May 26, 2026" },
      { t: "Equity bridge operational (community multi-sig)", done: true, date: "May 26, 2026" },
      { t: "CookieScan block explorer live", done: true },
      { t: "Genesis airdrop distributed", done: true, date: "May 26, 2026" },
    ],
  },
  {
    phase: "Phase 1",
    title: "Ecosystem Foundation",
    period: "May – Jun 2026",
    status: "complete",
    color: "#2563EB",
    items: [
      { t: "Two-way equity bridge live from day one", done: true, date: "May 26, 2026" },
      { t: "Cookoven staking platform deployment", done: true },
      { t: "CookieSwap DEX launch", done: true },
      { t: "BakedBazaar NFT marketplace", done: true },
      { t: "Validator onboarding program", done: true },
      { t: "Expanded signer transparency", done: true },
      { t: "Community governance proposals", done: true, date: "on-chain since May 2026" },
    ],
  },
  {
    phase: "Phase 2",
    title: "Bridge Evolution",
    period: "Jul 2026 →",
    status: "active",
    color: "#7B2FBE",
    items: [
      { t: "Hyperlane Warp Route live (instant, collateral-type)", done: true, date: "live Jul 3 · out of beta Jul 6, 2026" },
      { t: "Equity bridge deprecated — equity reserve dependency removed", done: true, date: "Jul 10, 2026" },
      { t: "Trustless cross-chain transfers", done: true, date: "Jul 3, 2026" },
      { t: "Additional chain bridge support", done: true },
      { t: "Expanded multi-sig signer pool", done: false },
    ],
  },
  {
    phase: "Phase 3",
    title: "Full Decentralization",
    period: "Future",
    status: "future",
    color: "#334155",
    items: [
      { t: "Broader DAO governance structure", done: false },
      { t: "On-chain proposal and voting system", done: false },
      { t: "Ecosystem grants program", done: false },
      { t: "Developer tooling and SDK", done: false },
      { t: "Institutional integrations", done: false },
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
      style={{ background: "var(--cook-bg)", padding: "6rem 0", transition: "background 0.3s ease" }}
      ref={ref}
    >
      <div className="container">
        {/* Header */}
        <div style={{
          marginBottom: "4rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div className="section-label" style={{ marginBottom: "1rem" }}>Roadmap</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            letterSpacing: "-0.03em",
            color: "var(--cook-text-primary)",
            marginBottom: "1rem",
          }}>
            Steady progress.<br />No detours.
          </h2>
          <p style={{ color: "var(--cook-text-secondary)", fontSize: "1rem", maxWidth: "520px", lineHeight: 1.65 }}>
            Phases 0 and 1 shipped on schedule. Phase 2 is nearly complete. Every milestone on this roadmap
            builds on infrastructure that already exists and a community that has demonstrated
            it shows up — consistently, without drama, over the long term.
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
                  color: "var(--cook-text-primary)",
                  marginBottom: "1rem",
                  letterSpacing: "-0.02em",
                }}>
                  {phase.title}{phase.period && (
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--cook-text-muted)", marginLeft: "0.6rem", letterSpacing: "0.05em" }}>
                      {phase.period}
                    </span>
                  )}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {phase.items.map((item) => (
                    <div key={item.t} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      {item.done ? (
                        <span aria-label="complete" style={{
                          color: "#22C55E",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          lineHeight: 1.4,
                          flexShrink: 0,
                          width: "0.9rem",
                        }}>{"\u2713"}</span>
                      ) : (
                        <div style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: phase.color,
                          margin: "0.45rem 0.2rem 0 0.25rem",
                          flexShrink: 0,
                        }} />
                      )}
                      <span style={{
                        fontSize: "0.875rem",
                        color: phase.status === "future" ? "var(--cook-text-muted)" : "var(--cook-text-secondary)",
                        lineHeight: 1.5,
                      }}>
                        {item.t}
                        {item.date && (
                          <span style={{ display: "block", fontSize: "0.68rem", color: "var(--cook-text-muted)", marginTop: "0.1rem" }}>
                            {item.date}
                          </span>
                        )}
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
