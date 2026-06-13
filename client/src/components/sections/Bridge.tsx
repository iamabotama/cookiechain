/*
 * BRIDGE SECTION
 * Design: Dark section with vault visual, step-by-step bridge mechanics
 * All URLs sourced from cookiechain.json
 */

import { useEffect, useRef, useState } from "react";
import { LINKS } from "@/lib/links";

const BRIDGE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663273809872/J3hDDZc9FEamYFSB95Wtww/cc-bridge-v2-Re3cF6hEhJUTpdDXTwnepT.webp";

const ENTER_STEPS = [
  { n: "01", text: "User deposits sCOOK into the Solana multi-sig lock wallet." },
  { n: "02", text: "6-of-11 signers approve the release on Cookie Chain via Cookie Squad." },
  { n: "03", text: "An equal amount of cCOOK is released from Vault 0 to the user's Cookie Chain address." },
];

const EXIT_STEPS = [
  { n: "01", text: "User's cCOOK is returned to Vault 0 on Cookie Chain." },
  { n: "02", text: "6-of-11 signers approve the release on Solana via Squads." },
  { n: "03", text: "An equal amount of sCOOK is released from the Solana lock wallet to the user." },
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
    desc: "Marketing, rewards, future fees. Locked; moves only by 6-of-11 multi-sig.",
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
      style={{ background: "#050505", padding: "6rem 0" }}
    >
      <div className="container">
        {/* Header */}
        <div style={{
          marginBottom: "4rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div className="section-label" style={{ marginBottom: "1rem" }}>Equity Bridge</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            letterSpacing: "-0.03em",
            color: "#ffffff",
            marginBottom: "1rem",
            maxWidth: "640px",
          }}>
            Every exit backed.<br />Every wallet public.<br />Every decision on-chain.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", maxWidth: "560px", lineHeight: 1.65 }}>
            The Cookie Chain equity bridge is not a mint/burn system. It is a custody transfer backed
            by a purchased reserve — the same model used by WBTC and stablecoin bridges.
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
          <div style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
            <img
              src={BRIDGE_IMG}
              alt="Cookie Chain Equity Bridge"
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
                    borderColor: activeTab === tab ? "#2563EB" : "rgba(255,255,255,0.12)",
                    background: activeTab === tab ? "rgba(37,99,235,0.12)" : "transparent",
                    color: activeTab === tab ? "#60A5FA" : "rgba(255,255,255,0.5)",
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
                    background: "#0d0d0d",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.55,
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
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                Every bridge movement requires 6-of-11 multi-sig approval on both chains.
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
            color: "#ffffff",
            marginBottom: "0.5rem",
          }}>
            Solana Lock Wallet Composition
          </h3>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
            Address:{" "}
            <code className="address-mono">DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx</code>
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {LOCK_WALLET_COMPONENTS.map((comp) => (
              <div key={comp.label} className="cook-card" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#ffffff" }}>
                    {comp.label}
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: comp.color }}>
                    {comp.pct}
                  </span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: comp.color, marginBottom: "0.5rem" }}>
                  {comp.amount}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
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
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#ffffff", marginBottom: "0.25rem" }}>
                Roadmap: Hyperlane Native Bridge
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>
                The current equity bridge is transitional. The planned migration to Hyperlane Warp Routes
                will replace custodial settlement with native burn/mint mechanics, removing reserve dependency
                entirely and enabling trustless cross-chain transfers.
              </div>
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
