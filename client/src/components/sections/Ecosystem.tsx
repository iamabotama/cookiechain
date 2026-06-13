/*
 * ECOSYSTEM SECTION
 * Design: Dark card grid with amber glow hover — mirrors Solana's institution cards
 * All URLs sourced from cookiechain.json
 */

import { useEffect, useRef, useState } from "react";
import { LINKS } from "@/lib/links";

const DAPPS = [
  {
    name: "Cookoven",
    tag: "STAKING",
    desc: "The native staking platform for $COOK. Earn rewards while securing the network. LST pool with community-governed reward rates.",
    href: LINKS.cookoven,
    color: "#2563EB",
    logo: "https://cookoven.xyz/assets/cookoven-CWUUnBt5.png",
  },
  {
    name: "CookieSwap",
    tag: "DEX",
    desc: "Decentralized exchange native to Cookie Chain. Swap, provide liquidity, and earn fees on the SVM network.",
    href: LINKS.cookieswap,
    color: "#7B2FBE",
    logo: "https://cookieswap.fun/_next/static/media/logo.bc35bf03.png",
  },
  {
    name: "CandyShop",
    tag: "SWAP",
    desc: "Swap interface powered by CookieScan. Fast, lightweight token swaps directly within the Cookie Chain explorer.",
    href: LINKS.candyshop,
    color: "#BAE6FD",
    logo: "https://swap.cookiescan.io/candyshoplogo.png",
  },
  {
    name: "CookieBox",
    tag: "APP",
    desc: "The Cookie Chain app hub. Access ecosystem tools, portfolio tracking, and community features in one place.",
    href: LINKS.cookiebox,
    color: "#60A5FA",
    logo: "https://cookiebox.app/assets/images/cookieboxlogo.png",
  },
  {
    name: "BakedBazaar",
    tag: "NFT MARKETPLACE",
    desc: "The NFT marketplace for Cookie Chain. List, bid, and collect digital assets on the community chain.",
    href: LINKS.bakedbazaar,
    color: "#7B2FBE",
    logo: "https://bakedbazaar.art/assets/baked-bazaar-logo-DkfJaY9t.png",
  },
  {
    name: "CookieScan",
    tag: "EXPLORER",
    desc: "Block explorer and analytics for Cookie Chain. Verify transactions, inspect wallets, and audit the reserve in real time.",
    href: LINKS.cookiescan,
    color: "#2563EB",
    logo: "https://cookiescan.io/newlogo.png",
  },
  {
    name: "gorboy",
    tag: "COMMUNITY",
    desc: "Community platform on Cookie Chain. The original gorboy community, now living on the chain they helped build.",
    href: LINKS.gorboy,
    color: "#BAE6FD",
    logo: "https://cdn.prod.website-files.com/691828ee7c1ee38a958dda54/6a03adbc5f009a668a39f520_gorboy_logo-p-500.png",
  },
  {
    name: "Cookienet Bridge",
    tag: "BRIDGE",
    desc: "The official equity bridge between Solana and Cookie Chain. Move $COOK between chains with 6-of-11 multi-sig security.",
    href: LINKS.bridge,
    color: "#60A5FA",
    logo: "https://cookiescan.io/attached_assets/cookie.png",
  },
];

const COMMUNITY_LINKS = [
  { label: "X / Twitter", href: LINKS.twitter, icon: "𝕏" },
  { label: "Telegram", href: LINKS.telegram, icon: "✈️" },
  { label: "Discord", href: LINKS.discord, icon: "💬" },
  { label: "GitHub", href: LINKS.github, icon: "⌥" },
  { label: "Docs", href: LINKS.docs, icon: "📖" },
  { label: "Whitepaper", href: LINKS.whitepaper, icon: "📄" },
  { label: "Community Site", href: LINKS.community_site, icon: "🍪" },
];

export default function Ecosystem() {
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
      id="ecosystem"
      ref={ref}
      style={{ background: "#050505", padding: "6rem 0" }}
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
            <div className="section-label" style={{ marginBottom: "1rem" }}>Ecosystem</div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                color: "#ffffff",
                lineHeight: 1.1,
              }}
            >
              Build on the chain<br />
              <span style={{
                background: "linear-gradient(135deg, #7B2FBE 0%, #2563EB 55%, #BAE6FD 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                the community owns.
              </span>
            </h2>
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", lineHeight: 1.7 }}>
              Cookie Chain's SVM compatibility means any Solana developer can deploy here with minimal
              changes. The ecosystem is growing — from DeFi primitives to NFT marketplaces to staking
              infrastructure, all built by the community.
            </p>
          </div>
        </div>

        {/* dApp cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            marginBottom: "4rem",
          }}
        >
          {DAPPS.map((app, i) => (
            <a
              key={app.name}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              className="cook-card"
              style={{
                padding: "1.5rem",
                textDecoration: "none",
                display: "block",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${0.05 + i * 0.06}s, transform 0.5s ease ${0.05 + i * 0.06}s`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <img
                    src={app.logo}
                    alt={app.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  color: app.color,
                  background: `${app.color}18`,
                  border: `1px solid ${app.color}30`,
                  padding: "0.2rem 0.5rem",
                  borderRadius: "0.25rem",
                  letterSpacing: "0.08em",
                }}>
                  {app.tag}
                </span>
              </div>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#ffffff",
                marginBottom: "0.5rem",
              }}>
                {app.name}
              </h3>
              <p style={{ fontSize: "0.775rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                {app.desc}
              </p>
              <div style={{
                marginTop: "1rem",
                fontSize: "0.75rem",
                color: app.color,
              }}>
                Visit {app.name} ↗
              </div>
            </a>
          ))}
        </div>

        {/* Community links */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
          }}
        >
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#ffffff",
            marginBottom: "1.5rem",
          }}>
            Join the community
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {COMMUNITY_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.1rem",
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.85rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(37,99,235,0.45)";
                  el.style.color = "#ffffff";
                  el.style.background = "rgba(37,99,235,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.color = "rgba(255,255,255,0.7)";
                  el.style.background = "#111111";
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </a>
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
