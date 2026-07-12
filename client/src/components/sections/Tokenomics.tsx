/*
 * TOKENOMICS SECTION — theme-aware
 * All colors via CSS variables (--cook-*) for automatic light/dark switching
 */

import { useEffect, useRef, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";
import { DataBadge, ProvenanceLegend, useLivePair, ProvenanceKind } from "@/components/Provenance";

/* Chain-side allocation, whitepaper v3.0 §3.1 — sums to exactly 1,000,000,000 (verified July 3, 2026) */
const ALLOCATIONS = [
  { name: "Vault 0 (Bridge Vault)", value: 57.72, color: "#2563EB", desc: "577,222,435.93 cCOOK — undistributed reserve; source of cCOOK for bridge entries" },
  { name: "Genesis & Community Holders", value: 28.74, color: "#7B2FBE", desc: "287,366,410.05 cCOOK — genesis distribution of 279,862,165.78 plus net bridge entries; 12,528 wallets" },
  { name: "Vault 2 — Baked Reserve (LST)", value: 10.09, color: "#38BDF8", desc: "100,879,769.20 cCOOK — LST/validator staking rewards, backed 1:1 by locked sCOOK" },
  { name: "Vault 1 — Cookie Jar", value: 3.09, color: "#F5A623", desc: "30,900,000.80 cCOOK — community treasury from app protocol-fee donations" },
  { name: "Hyperlane Collateral", value: 0.25, color: "#22C55E", desc: "2,543,348.53 cCOOK — instant bridge warp-route pool" },
  { name: "Bridge Operations", value: 0.11, color: "#60A5FA", desc: "1,088,035.49 cCOOK — legacy bridge working wallet, topped up by public multi-sig proposal" },
];

const SNAP = "Jul 3, 2026";
const KEY_STATS: {
  label: string; value: string; unit: string; highlight: boolean;
  prov: ProvenanceKind; source?: string; at?: string; href?: string; formula?: string; verifiedSince?: string;
}[] = [
  { label: "Initial Mint", value: "1,000,000,000", unit: "$COOK — minting permanently disabled", highlight: true,
    prov: "fixed", verifiedSince: "Jul 3, 2026", href: "https://solscan.io/token/36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1" },
  { label: "Circulating Supply", value: "~584,263,027", unit: "sCOOK on Solana", highlight: false,
    prov: "snapshot", at: SNAP, source: "Solscan", formula: "total supply − lock vault",
    href: "https://solscan.io/account/DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx" },
  { label: "Exit Backing Ratio", value: "~110%", unit: "equity reserve vs. user claims", highlight: true,
    prov: "snapshot", at: SNAP, source: "whitepaper §3.4", formula: "(lock vault − 100M) ÷ user-held cCOOK",
    href: "https://invest.cookiechain.wtf/whitepaper" },
  { label: "COOK Holder Wallets", value: "12,528", unit: "wallets on Cookie Chain", highlight: false,
    prov: "snapshot", at: SNAP, source: "cookiescan.io", href: "https://cookiescan.io" },
  { label: "Decimals", value: "6", unit: "SPL Token-2022", highlight: false,
    prov: "fixed", verifiedSince: "Jul 3, 2026", href: "https://solscan.io/token/36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1" },
  { label: "Further Minting", value: "None", unit: "mint authority revoked at creation", highlight: true,
    prov: "fixed", verifiedSince: "Jul 3, 2026", href: "https://solscan.io/token/36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: "var(--cook-surface-2)",
        border: "1px solid var(--cook-border)",
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
        maxWidth: "220px",
      }}>
        <div style={{ color: d.color, fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.25rem" }}>
          {d.name}
        </div>
        <div style={{ color: "var(--cook-text-primary)", fontSize: "1.25rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
          {d.value}%
        </div>
        <div style={{ color: "var(--cook-text-muted)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
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
  const { isLight } = useTheme();

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
      style={{
        background: "var(--cook-bg)",
        padding: "6rem 0",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.3s ease",
      }}
    >
      {/* Subtle network grid background */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663273809872/J3hDDZc9FEamYFSB95Wtww/cc-tokenomics-v2-7ePTX2xNdMHhLJce87xbMj.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: isLight ? 0.08 : 0.4,
        pointerEvents: "none",
        transition: "opacity 0.3s ease",
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{
          marginBottom: "4rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div className="section-label" style={{ marginBottom: "1rem" }}>Tokenomics</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            letterSpacing: "-0.03em",
            color: "var(--cook-text-primary)",
            marginBottom: "1rem",
            maxWidth: "600px",
          }}>
            One billion tokens.<br />Fixed. Forever.
          </h2>
          <p style={{ color: "var(--cook-text-secondary)", fontSize: "1rem", maxWidth: "520px", lineHeight: 1.65 }}>
            $COOK has a fixed total supply of 1,000,000,000 with no further minting. Every wallet is public,
            every reserve is auditable in real time, and every exit is backed.
          </p>
        </div>

        {/* Key stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1px",
          background: "var(--cook-border)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          marginBottom: "4rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
        }}>
          {KEY_STATS.map((stat) => (
            <div key={stat.label} style={{
              background: "var(--cook-surface)",
              padding: "1.5rem",
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: stat.highlight ? (stat.value === "None" ? "#38BDF8" : "#60A5FA") : "var(--cook-text-primary)",
                marginBottom: "0.25rem",
                letterSpacing: "-0.02em",
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--cook-text-secondary)", marginBottom: "0.125rem" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--cook-text-muted)", marginBottom: "0.4rem" }}>
                {stat.unit}
              </div>
              <DataBadge kind={stat.prov} source={stat.source} at={stat.at} href={stat.href} formula={stat.formula} verifiedSince={stat.verifiedSince} />
            </div>
          ))}
        </div>

        {/* Chart + allocation */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s",
        }} className="flex-col-mobile">
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
                color: "var(--cook-text-primary)",
                letterSpacing: "-0.03em",
              }}>1B</div>
              <div style={{ fontSize: "0.7rem", color: "var(--cook-text-muted)", letterSpacing: "0.1em" }}>FIXED SUPPLY</div>
            </div>
          </div>

          {/* Allocation list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {ALLOCATIONS.filter(a => a.value > 1).map((alloc) => (
              <div key={alloc.name} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                padding: "1rem",
                background: "var(--cook-card-bg)",
                borderRadius: "0.5rem",
                border: "1px solid var(--cook-border)",
                transition: "background 0.3s ease",
              }}>
                <div style={{
                  width: "3px",
                  height: "100%",
                  minHeight: "40px",
                  background: alloc.color,
                  borderRadius: "2px",
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "var(--cook-text-primary)" }}>
                      {alloc.name}
                    </span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: alloc.color }}>
                      {alloc.value}%
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--cook-text-muted)", lineHeight: 1.5 }}>
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
                  color: "#60A5FA",
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
