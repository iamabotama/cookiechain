/*
 * BRIDGE SECTION — theme-aware
 * All colors via CSS variables (--cook-*) for automatic light/dark switching
 */

import { useEffect, useRef, useState } from "react";
import { LINKS } from "@/lib/links";
import BridgeReserves from "@/components/sections/BridgeReserves";

const BRIDGE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663273809872/J3hDDZc9FEamYFSB95Wtww/cc-bridge-v3-HoiJzTu5TraFD9bwPP9a6n.webp";

const ENTER_STEPS = [
  { n: "01", text: "User sends sCOOK to the Hyperlane warp route on Solana; it locks in the collateral escrow (88q7…eZwq)." },
  { n: "02", text: "Hyperlane validators attest the transfer and a relayer delivers the message to Cookie Chain." },
  { n: "03", text: "An equal amount of cCOOK is released from the chain-side collateral pool (CL2J…yAKz) to the user's wallet — within seconds, no manual approvals." },
];

const EXIT_STEPS = [
  { n: "01", text: "User sends cCOOK to the Hyperlane warp route on Cookie Chain; it locks in the collateral pool (CL2J…yAKz)." },
  { n: "02", text: "Hyperlane validators attest the transfer and a relayer delivers the message to Solana." },
  { n: "03", text: "An equal amount of sCOOK is released from the Solana collateral escrow (88q7…eZwq) to the user — within seconds." },
];

const LOCK_WALLET_COMPONENTS = [
  {
    label: "Equity Reserve",
    amount: "~270M sCOOK",
    pct: "~27%",
    color: "#F5A623",
    desc: "Purchased by the project to back exits by genesis holders. Never used for any other purpose.",
  },
  {
    label: "Team Operations",
    amount: "~100M sCOOK",
    pct: "~10%",
    color: "#7B2FBE",
    desc: "Marketing, rewards, future fees. Locked; moves only by 6-of-10 multi-sig.",
  },
  {
    label: "User Bridge Deposits",
    amount: "~22.8M sCOOK",
    pct: "~2.28%",
    color: "#60A5FA",
    desc: "sCOOK deposited by users entering Cookie Chain since launch.",
  },
];

export default function Bridge() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"enter" | "exit">("enter");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const steps = activeTab === "enter" ? ENTER_STEPS : EXIT_STEPS;

  return (
    <section
      id="bridge"
      ref={ref}
      style={{ background: "var(--cook-bg-2)", padding: "6rem 0", transition: "background 0.3s ease" }}
    >
      <div className="container">
        {/* Header */}
        <div style={{
          marginBottom: "4rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div className="section-label" style={{ marginBottom: "1rem" }}>Bridge</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            letterSpacing: "-0.03em",
            color: "var(--cook-text-primary)",
            marginBottom: "1rem",
            maxWidth: "640px",
          }}>
            Every exit backed.<br />Every wallet public.<br />Every decision on-chain.
          </h2>
          <p style={{ color: "var(--cook-text-secondary)", fontSize: "1rem", maxWidth: "560px", lineHeight: 1.65 }}>
            The Cookie Chain bridge is not a mint/burn system. Transfers run instantly through
            Hyperlane collateral pools, and genesis holders are backed by a purchased reserve under
            community multi-sig custody — the same model used by WBTC and stablecoin bridges.
            No tokens are created or destroyed. The fixed 1B supply simply changes custody.
          </p>
        </div>

        {/* Main grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          marginBottom: "4rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
        }} className="flex-col-mobile">
          {/* Bridge visual */}
          <div style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid rgba(123,47,190,0.25)", boxShadow: "0 0 40px rgba(123,47,190,0.15)" }}>
            <img
              src={BRIDGE_IMG}
              alt="Cookie Chain Bridge"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: "280px" }}
            />
          </div>

          {/* Bridge mechanics */}
          <div>
            {/* Tab switcher */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {(["enter", "exit"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "9999px",
                    border: "1px solid",
                    borderColor: activeTab === tab ? "#2563EB" : "var(--cook-border)",
                    background: activeTab === tab ? "rgba(37,99,235,0.12)" : "transparent",
                    color: activeTab === tab ? "#60A5FA" : "var(--cook-text-secondary)",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {tab === "enter" ? "Solana → Cookie Chain" : "Cookie Chain → Solana"}
                </button>
              ))}
            </div>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {steps.map((step, i) => (
                <div key={step.n} style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.5s ease ${0.2 + i * 0.1}s, transform 0.5s ease ${0.2 + i * 0.1}s`,
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.7rem",
                    color: "#60A5FA",
                    fontWeight: 500,
                    paddingTop: "0.15rem",
                    flexShrink: 0,
                    width: "24px",
                  }}>
                    {step.n}
                  </div>
                  <div style={{
                    flex: 1,
                    padding: "0.875rem 1rem",
                    background: "var(--cook-card-bg)",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--cook-border)",
                    fontSize: "0.875rem",
                    color: "var(--cook-text-secondary)",
                    lineHeight: 1.55,
                    transition: "background 0.3s ease",
                  }}>
                    {step.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a
                href={LINKS.bridge}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-amber"
                style={{ fontSize: "0.8rem", padding: "0.5rem 1.1rem" }}
              >
                Use the Bridge ↗
              </a>
              <a
                href={LINKS.multisig}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ fontSize: "0.8rem", padding: "0.5rem 1.1rem" }}
              >
                View Multi-Sig ↗
              </a>
            </div>

            <div style={{
              marginTop: "1.25rem",
              padding: "1rem",
              background: "rgba(37,99,235,0.06)",
              borderRadius: "0.5rem",
              border: "1px solid rgba(37,99,235,0.18)",
            }}>
              <div style={{ fontSize: "0.8rem", color: "#60A5FA", fontWeight: 600, marginBottom: "0.25rem" }}>
                Approval threshold
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--cook-text-secondary)", lineHeight: 1.5 }}>
                Transfers run instantly on the Hyperlane bridge. Reserve custody remains with the 6-of-10 community multi-sigs on both chains; the legacy escrow flow was deprecated July 10, 2026.
                Cookie Squad on Cookie Chain. Squads on Solana.
              </div>
            </div>
          </div>
        </div>

        {/* Lock wallet breakdown */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
        }}>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "var(--cook-text-primary)",
            marginBottom: "0.5rem",
          }}>
            Solana Lock Wallet Composition
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--cook-text-muted)", marginBottom: "1.5rem" }}>
            Address:{" "}
            <code className="address-mono">DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx</code>
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {LOCK_WALLET_COMPONENTS.map((comp) => (
              <div key={comp.label} className="cook-card" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "var(--cook-text-primary)" }}>
                    {comp.label}
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: comp.color }}>
                    {comp.pct}
                  </span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: comp.color, marginBottom: "0.5rem" }}>
                  {comp.amount}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--cook-text-muted)", lineHeight: 1.5 }}>
                  {comp.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Hyperlane roadmap note */}
          <div style={{
            marginTop: "2rem",
            padding: "1.25rem 1.5rem",
            background: "rgba(123,47,190,0.07)",
            border: "1px solid rgba(123,47,190,0.22)",
            borderRadius: "0.75rem",
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start",
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#7B2FBE",
              boxShadow: "0 0 8px #7B2FBE",
              marginTop: "0.35rem",
              flexShrink: 0,
            }} />
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "var(--cook-text-primary)", marginBottom: "0.25rem" }}>
                Live: Hyperlane Bridge (Jul 3 · beta exit Jul 6 · sole path since Jul 10, 2026)
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--cook-text-secondary)", lineHeight: 1.55 }}>
                The Hyperlane Warp Route is live at hyperlane.cookiescan.io: instant, automated, collateral-type transfers (out of beta July 6, 2026). The legacy equity bridge was deprecated on July 10, 2026 — Hyperlane is now the sole transfer path. The shipped implementation uses collateral pools rather than the
                originally planned burn/mint mechanics, achieving the same goal: transfers no longer
                depend on custodial settlement, and the multi-sig reserves now serve purely as backing
                rather than routing.
              </div>
            </div>
          </div>
        </div>
        <BridgeReserves />
        </div>

      <style>{`
        @media (max-width: 768px) {
          .flex-col-mobile { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
