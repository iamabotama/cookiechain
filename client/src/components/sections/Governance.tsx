/*
 * GOVERNANCE SECTION — theme-aware
 * All colors via CSS variables (--cook-*) for automatic light/dark switching
 */

import { useEffect, useRef, useState } from "react";

const GOV_CARDS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2563EB" strokeWidth="1.5"/>
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "6-of-11 Multi-Sig",
    desc: "All bridge releases and treasury movements require approval from 6 of 11 community signers on both chains simultaneously. Cookiequads on Cookie Chain. Squads on Solana.",
    color: "#2563EB",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="#7B2FBE" strokeWidth="1.5"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#7B2FBE" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Community Signers",
    desc: "All 11 signers are long-standing community members with 8–11 months of continuous involvement predating Cookie Chain's launch. They built the rescue — they didn't arrive at launch.",
    color: "#7B2FBE",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7L12 3z" stroke="#BAE6FD" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Single-Purpose Wallets",
    desc: "Each reserve wallet has one defined purpose. The equity reserve is used exclusively for user exits. The team operations allocation is never used for bridge settlement. No commingling.",
    color: "#BAE6FD",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 12h18M12 3l9 9-9 9" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Fully Auditable",
    desc: "Every custodied wallet is publicly identified with its exact on-chain address. Any unauthorized movement would be immediately visible to all holders. Real-time verification at cookiescan.io.",
    color: "#60A5FA",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Expanding Signer Pool",
    desc: "As the project matures, the signer pool will expand. Any change will maintain the approval threshold above 50% of the pool. Expanded signer transparency, including verified identities, is under consideration.",
    color: "#2563EB",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#7B2FBE" strokeWidth="1.5"/>
        <path d="M12 8v4l3 3" stroke="#7B2FBE" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Future: Broader DAO",
    desc: "Governance is planned to expand to a broader DAO structure as the ecosystem matures. The current multi-sig model is a transitional phase toward fully decentralized community governance.",
    color: "#7B2FBE",
  },
];

export default function Governance() {
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
      id="governance"
      ref={ref}
      style={{ background: "var(--cook-bg)", padding: "6rem 0", transition: "background 0.3s ease" }}
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "flex-end",
            marginBottom: "3rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="flex-col-mobile"
        >
          <div>
            <div className="section-label" style={{ marginBottom: "1rem" }}>Governance & Security</div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "var(--cook-text-primary)",
              lineHeight: 1.1,
            }}>
              Secured by the<br />community that built it.
            </h2>
          </div>
          <div>
            <p style={{ color: "var(--cook-text-secondary)", fontSize: "1rem", lineHeight: 1.7 }}>
              Whether you're a holder, validator, builder, or bridge user — the governance
              model is designed to protect your position at every step. Transparent by default.
              Auditable in real time.
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1px",
          background: "var(--cook-border)",
          borderRadius: "1rem",
          overflow: "hidden",
        }}>
          {GOV_CARDS.map((card, i) => (
            <div
              key={card.title}
              style={{
                background: "var(--cook-surface)",
                padding: "1.75rem",
                transition: "background 0.25s ease",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
              } as any}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cook-card-bg-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cook-surface)"; }}
            >
              <div style={{ marginBottom: "1rem" }}>{card.icon}</div>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--cook-text-primary)",
                marginBottom: "0.5rem",
              }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "0.825rem", color: "var(--cook-text-secondary)", lineHeight: 1.6 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Risk disclosure note */}
        <div style={{
          marginTop: "3rem",
          padding: "1.5rem",
          background: "var(--cook-surface)",
          border: "1px solid var(--cook-border)",
          borderRadius: "0.75rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s, background 0.3s ease",
        }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "var(--cook-text-secondary)", marginBottom: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Risk Disclosure
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--cook-text-muted)", lineHeight: 1.65, maxWidth: "800px" }}>
            The Cookie Chain bridge is operated by community multi-signature wallets rather than autonomous smart contracts.
            Security depends on the integrity and key security of the signer group. Compromise or collusion of six signers
            could result in unauthorized movement of reserve funds. The planned migration to Hyperlane Warp Routes will
            replace this dependency with native burn/mint mechanics. This is not financial advice. DYOR and verify on-chain.
          </p>
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
