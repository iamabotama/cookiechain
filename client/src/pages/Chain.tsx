/*
 * COOKIE CHAIN — THE CHAIN PAGE
 * Design: "Dark Forge v2" — Solana-inspired deep black + violet/electric-blue/ice palette
 * Layout: Bold left column "One Billion. Fixed. Forever." + live CookieScan iframe right
 * Live data: CookieScan explorer embed + DexScreener API for chain stats
 */

import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, Cpu, Zap, Box, Clock, Activity, Shield } from "lucide-react";
import StreamCanvas from "../components/StreamCanvas";

const COOKIESCAN_URL = "https://cookiescan.io";
const COOKIE_LOGO = "/cookie-logo.webp";

// DexScreener for price context
const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/tokens/36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1";

interface PriceData {
  priceUsd: string;
  priceChange: { h24: number };
  marketCap: number;
}

const CHAIN_FACTS = [
  {
    icon: <Box size={18} />,
    label: "Total Supply",
    value: "1,000,000,000",
    unit: "$COOK",
    note: "Fixed forever. No minting authority.",
    color: "#BAE6FD",
  },
  {
    icon: <Shield size={18} />,
    label: "Bridge Backing",
    value: "~100.4%",
    unit: "equity-backed",
    note: "Bridge reserve exceeds circulating sCOOK supply.",
    color: "#A78BFA",
  },
  {
    icon: <Zap size={18} />,
    label: "Consensus",
    value: "SVM",
    unit: "Layer 1",
    note: "Solana Virtual Machine — battle-tested execution.",
    color: "#60A5FA",
  },
  {
    icon: <Cpu size={18} />,
    label: "Governance",
    value: "6-of-11",
    unit: "multi-sig",
    note: "No single point of control. Community-secured.",
    color: "#818CF8",
  },
  {
    icon: <Clock size={18} />,
    label: "Genesis",
    value: "May 26, 2026",
    unit: "launched",
    note: "12,528 genesis wallets honored from snapshot.",
    color: "#7DD3FC",
  },
  {
    icon: <Activity size={18} />,
    label: "Circulating",
    value: "~607.2M",
    unit: "$COOK",
    note: "Remaining held in bridge reserve wallet.",
    color: "#93C5FD",
  },
];

export default function Chain() {
  const [price, setPrice] = useState<PriceData | null>(null);
  const [scanLoaded, setScanLoaded] = useState(false);

  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch(DEXSCREENER_API);
      const json = await res.json();
      const pair = json.pairs?.[0];
      if (pair) setPrice(pair);
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30_000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n.toFixed(2)}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000000", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Sticky nav bar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 2rem",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#BAE6FD")}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src={COOKIE_LOGO} alt="Cookie Chain" style={{ width: "24px", height: "24px", borderRadius: "50%", filter: "drop-shadow(0 0 6px rgba(37,99,235,0.5))" }} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#ffffff", letterSpacing: "0.04em" }}>
            THE CHAIN
          </span>
          {price && (
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
              · $COOK{" "}
              <span style={{ color: "#BAE6FD", fontWeight: 600 }}>
                ${parseFloat(price.priceUsd).toFixed(8)}
              </span>
              {" "}
              <span style={{ color: price.priceChange.h24 >= 0 ? "#4ADE80" : "#F87171" }}>
                {price.priceChange.h24 >= 0 ? "+" : ""}{price.priceChange.h24.toFixed(2)}%
              </span>
            </span>
          )}
        </div>

        <a
          href={COOKIESCAN_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(186,230,253,0.7)", textDecoration: "none", fontSize: "0.8rem", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#BAE6FD")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(186,230,253,0.7)")}
        >
          Open CookieScan <ExternalLink size={13} />
        </a>
      </div>

      {/* Hero statement + iframe split */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        minHeight: "calc(100vh - 60px)",
        gap: 0,
      }}
        className="chain-split"
      >
        {/* LEFT — bold statement column */}
        <div style={{
          padding: "4rem 3rem 4rem 4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Live stream animation — low density, slow, behind text */}
          <StreamCanvas
            style={{ zIndex: 0, opacity: 1 }}
            maxStreams={7}
            spawnRate={0.01}
          />

          {/* Section label */}
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            color: "rgba(186,230,253,0.5)",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}>
            CookieChain SVM · Live Network
          </div>

          {/* The big statement */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 4vw, 3.75rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            margin: "0 0 1rem",
          }}>
            One Billion<br />
            <span style={{
              color: "#7DD3FC",
              textShadow: "0 0 40px rgba(125,211,252,0.5), 0 0 80px rgba(96,165,250,0.25)",
            }}>
              Tokens.
            </span>
          </h1>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 4vw, 3.75rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            margin: "0 0 1rem",
          }}>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Fixed.</span>
          </h1>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 4vw, 3.75rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            margin: "0 0 2.5rem",
            background: "linear-gradient(135deg, #7B2FBE 0%, #2563EB 50%, #7DD3FC 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Forever.
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "420px",
            marginBottom: "3rem",
          }}>
            No minting authority exists. No inflation schedule. No team allocation with unlock cliffs. The supply was set at genesis and cannot be changed by anyone — including the founding team.
          </p>

          {/* Market cap context */}
          {price && (
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "0.875rem",
              padding: "1.25rem 1.5rem",
              marginBottom: "2.5rem",
              display: "inline-flex",
              gap: "2rem",
              flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Market Cap</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#ffffff" }}>{fmt(price.marketCap)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Price</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#BAE6FD" }}>${parseFloat(price.priceUsd).toFixed(8)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>24h</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: price.priceChange.h24 >= 0 ? "#4ADE80" : "#F87171" }}>
                  {price.priceChange.h24 >= 0 ? "+" : ""}{price.priceChange.h24.toFixed(2)}%
                </div>
              </div>
            </div>
          )}

          {/* Chain facts grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}>
            {CHAIN_FACTS.map((fact) => (
              <div
                key={fact.label}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "0.75rem",
                  padding: "0.875rem 1rem",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${fact.color}40`;
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.025)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: fact.color, marginBottom: "0.4rem" }}>
                  {fact.icon}
                  <span style={{ fontSize: "0.65rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                    {fact.label}
                  </span>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#ffffff", marginBottom: "0.2rem" }}>
                  {fact.value} <span style={{ color: fact.color, fontSize: "0.75rem", fontWeight: 500 }}>{fact.unit}</span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                  {fact.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — live CookieScan iframe */}
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: "#000",
        }}>
          {/* iframe header bar */}
          <div style={{
            padding: "0.875rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(8,6,18,0.9)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: scanLoaded ? "#4ADE80" : "#F59E0B",
                boxShadow: scanLoaded ? "0 0 8px #4ADE80" : "0 0 8px #F59E0B",
                transition: "all 0.5s",
              }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>
                CookieScan — Live Explorer
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
                cookiescan.io
              </span>
              <a
                href={COOKIESCAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  color: "rgba(186,230,253,0.6)",
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#BAE6FD")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(186,230,253,0.6)")}
              >
                Open full <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* The iframe */}
          <div style={{ flex: 1, position: "relative", minHeight: "600px" }}>
            {!scanLoaded && (
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#000",
                gap: "1rem",
                zIndex: 2,
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.08)",
                  borderTop: "2px solid #7B2FBE",
                  animation: "spin 0.8s linear infinite",
                }} />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif" }}>
                  Loading CookieScan…
                </span>
              </div>
            )}
            <iframe
              src={COOKIESCAN_URL}
              title="CookieScan Live Explorer"
              onLoad={() => setScanLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                minHeight: "calc(100vh - 60px - 49px)",
                border: "none",
                display: "block",
                background: "#000",
                opacity: scanLoaded ? 1 : 0,
                transition: "opacity 0.5s ease",
              }}
              allow="clipboard-write"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .chain-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
