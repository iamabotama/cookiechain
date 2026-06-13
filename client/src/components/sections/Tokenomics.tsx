/*
 * TOKENOMICS SECTION
 * Design: Dark section with amber/mint/purple donut chart + allocation breakdown
 * Data from whitepaper v2.0 (June 5, 2026)
 * Left: donut chart (recharts), Right: allocation table + key stats
 */

import { useEffect, useRef, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const ALLOCATIONS = [
  { name: "Vault 0 (Bridge Reserve)", value: 59.02, color: "#F5A623", desc: "Undistributed reserve; source of cCOOK for bridge entries" },
  { name: "Genesis & Community Holders", value: 27.98, color: "#14F195", desc: "12,528 wallets — snapshot distribution to legacy $GOR holders" },
  { name: "LST / Staking Rewards", value: 10.09, color: "#9945FF", desc: "Staking reward distribution pool" },
  { name: "Bridge Reserve Wallet", value: 1.72, color: "#FF6B35", desc: "Bridge liquidity and claims support buffer" },
  { name: "Other / Rounding", value: 1.19, color: "#444444", desc: "Reconciliation buffer" },
];

const KEY_STATS = [
  { label: "Total Supply", value: "1,000,000,000", unit: "$COOK", highlight: true },
  { label: "Circulating Supply", value: "~607,200,000", unit: "sCOOK on Solana", highlight: false },
  { label: "Exit Backing Ratio", value: "~100.4%", unit: "equity reserve", highlight: true },
  { label: "Genesis Wallets Honored", value: "12,528", unit: "wallets", highlight: false },
  { label: "Decimals", value: "9", unit: "fixed", highlight: false },
  { label: "Further Minting", value: "None", unit: "fixed supply forever", highlight: true },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
        maxWidth: "220px",
      }}>
        <div style={{ color: d.color, fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.25rem" }}>
          {d.name}
        </div>
        <div style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
          {d.value}%
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
          {d.desc}
        </div>
      </div>
    );
  }
  return null;
};

export default function Tokenomics() {
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
      id="tokenomics"
      ref={ref}
      style={{ background: "#000000", padding: "6rem 0" }}
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
          <div className="section-label" style={{ marginBottom: "1rem" }}>Tokenomics</div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: "1rem",
              maxWidth: "600px",
            }}
          >
            One billion tokens.<br />Fixed. Forever.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", maxWidth: "520px", lineHeight: 1.65 }}>
            $COOK has a fixed total supply of 1,000,000,000 with no further minting. Every wallet is public,
            every reserve is auditable in real time, and every exit is backed.
          </p>
        </div>

        {/* Key stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "0.75rem",
            overflow: "hidden",
            marginBottom: "4rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
          }}
        >
          {KEY_STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#0a0a0a",
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: stat.highlight ? (stat.value === "None" ? "#14F195" : "#F5A623") : "#ffffff",
                  marginBottom: "0.25rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.125rem" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)" }}>
                {stat.unit}
              </div>
            </div>
          ))}
        </div>

        {/* Chart + allocation */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s",
          }}
          className="flex-col-mobile"
        >
          {/* Donut chart */}
          <div style={{ height: "360px", position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ALLOCATIONS}
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="78%"
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {ALLOCATIONS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1.75rem",
                color: "#ffffff",
                letterSpacing: "-0.03em",
              }}>1B</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>FIXED SUPPLY</div>
            </div>
          </div>

          {/* Allocation list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {ALLOCATIONS.filter(a => a.value > 1).map((alloc) => (
              <div
                key={alloc.name}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem",
                  background: "#0d0d0d",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    width: "3px",
                    height: "100%",
                    minHeight: "40px",
                    background: alloc.color,
                    borderRadius: "2px",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#ffffff" }}>
                      {alloc.name}
                    </span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: alloc.color }}>
                      {alloc.value}%
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                    {alloc.desc}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: "0.5rem" }}>
              <a
                href="https://cookiescan.io/top-holders"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.8rem",
                  color: "#F5A623",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                Verify on-chain at cookiescan.io ↗
              </a>
            </div>
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
