/*
 * HERO SECTION — v3 (theme-aware)
 * Design: Pure black (dark) / pure white (light) + violet/electric-blue/ice ribbons (right side)
 * All colors via CSS variables (--cook-*) for automatic light/dark switching
 */

import { useEffect, useState, useCallback } from "react";
import { LINKS } from "@/lib/links";
import { useTheme } from "@/contexts/ThemeContext";
import { DataBadge, useLivePair } from "@/components/Provenance";

const HERO_BG_DARK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663273809872/J3hDDZc9FEamYFSB95Wtww/cc-hero-v3-fycfSqHn94rbr25XpikzPM.webp";
const HERO_BG_LIGHT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663273809872/J3hDDZc9FEamYFSB95Wtww/cc-hero-light-v1-c75qfAEzeM35cNG5eSLnku.webp";
const COOKIESCAN_RPC = "https://rpc.cookiescan.io";

function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [slot, setSlot] = useState("—");
  const [blockHeight, setBlockHeight] = useState("—");
  const [tps, setTps] = useState("—");
  const [statsAt, setStatsAt] = useState<Date | null>(null);
  const { isLight } = useTheme();
  const { pair } = useLivePair();

  const fetchChainStats = useCallback(async () => {
    try {
      const [slotRes, heightRes, perfRes] = await Promise.all([
        fetch(COOKIESCAN_RPC, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getSlot", params: [] }) }),
        fetch(COOKIESCAN_RPC, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "getBlockHeight", params: [] }) }),
        fetch(COOKIESCAN_RPC, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 3, method: "getRecentPerformanceSamples", params: [1] }) }),
      ]);
      const [slotData, heightData, perfData] = await Promise.all([slotRes.json(), heightRes.json(), perfRes.json()]);
      if (slotData.result) setSlot(fmtNum(slotData.result));
      if (heightData.result) setBlockHeight(fmtNum(heightData.result));
      if (perfData.result?.[0]) {
        const s = perfData.result[0];
        setTps(fmtNum(Math.round(s.numTransactions / s.samplePeriodSecs)));
      }
      if (slotData.result) setStatsAt(new Date());
    } catch { /* silent fail */ }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchChainStats();
    const interval = setInterval(fetchChainStats, 5_000);
    return () => clearInterval(interval);
  }, [fetchChainStats]);

  // Switch hero background based on theme
  const heroBg = isLight ? HERO_BG_LIGHT : HERO_BG_DARK;
  const panelBg = isLight ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.58)";
  const panelBorder = isLight ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.08)";
  const headlineColor = isLight ? "#0f0f14" : "#ffffff";
  const bodyColor = isLight ? "rgba(15,15,20,0.85)" : "rgba(255,255,255,0.85)";
  const caLabelColor = isLight ? "rgba(15,15,20,0.65)" : "rgba(255,255,255,0.65)";
  const statBarBg = isLight ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.7)";
  const statBarBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)";
  const statValueColor = isLight ? "#0f0f14" : "#ffffff";
  const statLabelColor = isLight ? "rgba(15,15,20,0.5)" : "rgba(255,255,255,0.4)";
  const statDivColor = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)";

  return (
    <section
      id="overview"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--cook-bg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.3s ease",
      }}
    >
      {/* Background ribbon image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
        transition: "opacity 0.4s ease",
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
        }}
      >
        {/* Frosted panel — adapts to theme */}
        <div style={{
          background: panelBg,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "1.25rem",
          border: `1px solid ${panelBorder}`,
          padding: "2.5rem 2.75rem 2.25rem",
          maxWidth: "600px",
          width: "fit-content",
          boxShadow: isLight ? "0 8px 40px rgba(0,0,0,0.12)" : "0 8px 40px rgba(0,0,0,0.4)",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}>
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
            color: headlineColor,
            marginBottom: "1.5rem",
            textShadow: isLight ? "none" : "0 2px 40px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.6)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s, color 0.3s ease",
          }}>
            The community chain<br />
            <span style={{
              color: "#38BDF8",
              textShadow: "0 0 30px rgba(125,211,252,0.7), 0 0 60px rgba(96,165,250,0.4)",
            }}>
              built to last.
            </span>
          </h1>

          {/* Subtext */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1.125rem",
            lineHeight: 1.65,
            color: bodyColor,
            marginBottom: "2.5rem",
            maxWidth: "520px",
            textShadow: isLight ? "none" : "0 1px 20px rgba(0,0,0,0.9)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s, color 0.3s ease",
          }}>
            A high-performance SVM Layer 1 built by the community that chose to stay. Fixed 1B supply. ~110% equity-backed reserves. 6-of-10 multi-sig governance. Instant Hyperlane bridge. Every metric trending forward — no pivots, no resets, no signs of stopping.
          </p>

          {/* Live price strip — data responsibility delegated to provider */}
          {pair && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem",
              opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.25s",
            }}>
              <span style={{ color: "var(--cook-text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>$COOK</span>
              <span style={{ color: "var(--cook-text-primary)", fontWeight: 700 }}>
                ${pair.priceUsd < 0.01 ? pair.priceUsd.toFixed(7) : pair.priceUsd.toFixed(4)}
              </span>
              <span style={{ color: pair.change24h >= 0 ? "#22C55E" : "#EF4444", fontWeight: 600, fontSize: "0.85rem" }}>
                {pair.change24h >= 0 ? "+" : ""}{pair.change24h.toFixed(1)}% 24h
              </span>
              <DataBadge kind="live" source="DexScreener" at={pair.fetchedAt} cadence="refreshes every 30s"
                href="https://dexscreener.com/solana/DRaDjBfCtCCD2Kb1rzMtom3oDiGnwTu9LBgA7WA4LEzx" />
            </div>
          )}

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
              className="btn-primary"
            >
              View Tokenomics
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/whitepaper" className="btn-outline">
              Read Whitepaper
            </a>
            <a
              href="/chain"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "rgba(167,139,250,0.9)",
                textDecoration: "none",
                padding: "0.5rem 0",
                transition: "color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#A78BFA")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(167,139,250,0.9)")}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="8" cy="8" r="6" stroke="#A78BFA" strokeWidth="1.5"/>
                <circle cx="8" cy="8" r="2" fill="#A78BFA"/>
                <path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Explore The Chain
            </a>
          </div>

          {/* Token address */}
          <div style={{
            marginTop: "2rem",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease 0.4s",
          }}>
            <span style={{ fontSize: "0.75rem", color: caLabelColor, marginRight: "0.5rem", transition: "color 0.3s" }}>
              Solana CA (sCOOK):
            </span>
            <code className="address-mono" style={{ fontSize: "0.7rem", color: "rgba(186,230,253,0.85)" }}>
              {LINKS.ca_solana}
            </code>
          </div>
        </div>
      </div>

      {/* Chain stat bar */}
      <div style={{
        position: "relative",
        zIndex: 10,
        borderTop: `1px solid ${statBarBorder}`,
        background: statBarBg,
        backdropFilter: "blur(12px)",
        transition: "background 0.3s ease",
      }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          }}>
            {[
              { label: "Current Slot", value: slot, kind: "rpc" },
              { label: "Block Height", value: blockHeight, kind: "rpc" },
              { label: "TPS", value: tps, kind: "rpc" },
              { label: "Avg Fee / TX", value: "0.000005 COOK", kind: "fixed" },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                padding: "1.25rem 0",
                borderLeft: i > 0 ? `1px solid ${statDivColor}` : "none",
                paddingLeft: i > 0 ? "1.5rem" : "0",
                paddingRight: "1.5rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: statValueColor,
                    transition: "color 0.3s ease",
                  }}>
                    {stat.value}
                  </span>
                  {stat.kind === "fixed" ? (
                    <DataBadge kind="fixed" verifiedSince="Jul 3, 2026" href="https://docs.cookiechain.wtf" />
                  ) : statsAt ? (
                    <DataBadge kind="live" source="rpc.cookiescan.io" at={statsAt} cadence="refreshes every 5s" href="https://cookiescan.io" />
                  ) : (
                    <DataBadge kind="snapshot" at="Jul 3, 2026" source="cookiescan.io" href="https://cookiescan.io" />
                  )}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.75rem",
                  color: statLabelColor,
                  transition: "color 0.3s ease",
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
          50% { opacity: 0.35; }
        }
      `}</style>
    </section>
  );
}
