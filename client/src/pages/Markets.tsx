/*
 * COOKIE CHAIN — MARKETS PAGE
 * Design: "Dark Forge v2" — Solana-inspired deep black + violet/electric-blue/ice palette
 * Live data: DexScreener public API (no auth) polled every 30s
 * Chart: GeckoTerminal dark embed (PumpSwap pair)
 * Pair: DRaDjBfCtCCD2Kb1rzMtom3oDiGnwTu9LBgA7WA4LEzx (COOK/SOL on PumpSwap)
 */

import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, ExternalLink, Activity, DollarSign, BarChart3, Droplets, Clock } from "lucide-react";

const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/tokens/36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1";
const PAIR_ADDRESS = "DRaDjBfCtCCD2Kb1rzMtom3oDiGnwTu9LBgA7WA4LEzx";
const GECKO_EMBED = `https://www.geckoterminal.com/solana/pools/${PAIR_ADDRESS}?embed=1&info=0&swaps=1&light_chart=0&chart_type=price&resolution=15m&bg_color=000000&text_color=BAE6FD`;

interface PairData {
  priceUsd: string;
  priceNative: string;
  priceChange: { h1: number; h6: number; h24: number };
  volume: { h24: number; h6: number; h1: number };
  liquidity: { usd: number };
  fdv: number;
  marketCap: number;
  txns: { h24: { buys: number; sells: number }; h1: { buys: number; sells: number } };
}

function fmt(n: number, decimals = 2): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(decimals)}K`;
  return `$${n.toFixed(decimals)}`;
}

function fmtPrice(p: string): string {
  const n = parseFloat(p);
  if (n < 0.0001) return `$${n.toFixed(8)}`;
  if (n < 0.01) return `$${n.toFixed(6)}`;
  return `$${n.toFixed(4)}`;
}

function PriceChange({ value }: { value: number }) {
  const isPos = value >= 0;
  return (
    <span style={{
      color: isPos ? "#4ADE80" : "#F87171",
      display: "inline-flex",
      alignItems: "center",
      gap: "2px",
      fontWeight: 600,
    }}>
      {isPos ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      {isPos ? "+" : ""}{value.toFixed(2)}%
    </span>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(8,6,18,0.75)",
      border: "1.5px solid transparent",
      backgroundImage: "linear-gradient(rgba(8,6,18,0.75),rgba(8,6,18,0.75)) padding-box, linear-gradient(135deg,rgba(123,47,190,0.4) 0%,rgba(37,99,235,0.3) 55%,rgba(186,230,253,0.2) 100%) border-box",
      borderRadius: "1rem",
      padding: "1.25rem 1.5rem",
      backdropFilter: "blur(12px)",
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.5rem",
      transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundImage = "linear-gradient(rgba(8,6,18,0.65),rgba(8,6,18,0.65)) padding-box, linear-gradient(135deg,rgba(123,47,190,0.65) 0%,rgba(37,99,235,0.5) 55%,rgba(186,230,253,0.35) 100%) border-box";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 24px rgba(123,47,190,0.2), 0 0 48px rgba(37,99,235,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundImage = "linear-gradient(rgba(8,6,18,0.75),rgba(8,6,18,0.75)) padding-box, linear-gradient(135deg,rgba(123,47,190,0.4) 0%,rgba(37,99,235,0.3) 55%,rgba(186,230,253,0.2) 100%) border-box";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(186,230,253,0.6)", fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
        <span style={{ color: "#7B2FBE" }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#ffffff", letterSpacing: "-0.02em" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>}
    </div>
  );
}

export default function Markets() {
  const [pair, setPair] = useState<PairData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch(DEXSCREENER_API);
      const json = await res.json();
      // Find the primary PumpSwap pair
      const primary = json.pairs?.find((p: any) => p.pairAddress === PAIR_ADDRESS) || json.pairs?.[0];
      if (primary) {
        setPair(primary);
        setLastUpdated(new Date());
        setError(false);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const price = pair ? fmtPrice(pair.priceUsd) : "—";
  const h24Change = pair?.priceChange?.h24 ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "#000000", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top nav bar */}
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
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#BAE6FD")}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Live price ticker in nav */}
          {pair && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: "0.05em" }}>$COOK</span>
              <span style={{ color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>{price}</span>
              <PriceChange value={h24Change} />
            </div>
          )}
          <button
            onClick={() => fetchData(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.75rem",
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.2s",
              padding: "0.25rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#BAE6FD")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Loading..."}
          </button>
        </div>

        <a
          href={`https://dexscreener.com/solana/${PAIR_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(186,230,253,0.7)", textDecoration: "none", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#BAE6FD")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(186,230,253,0.7)")}
        >
          View on DexScreener <ExternalLink size={13} />
        </a>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 2rem 4rem" }}>
        {/* Page header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden",
              filter: "drop-shadow(0 0 10px rgba(123,47,190,0.5))",
            }}>
              <img src="/cookie-logo.webp" alt="$COOK" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "#ffffff", margin: 0, letterSpacing: "-0.03em" }}>
                Cookie <span style={{ color: "#BAE6FD" }}>/ $COOK</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                Solana (sCOOK) · PumpSwap · Live data via DexScreener
              </p>
            </div>
          </div>

          {/* Big price display */}
          {loading ? (
            <div style={{ height: "4rem", display: "flex", alignItems: "center" }}>
              <div style={{ width: "200px", height: "3rem", background: "rgba(255,255,255,0.05)", borderRadius: "0.5rem", animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          ) : error ? (
            <p style={{ color: "#F87171", fontFamily: "'DM Sans', sans-serif" }}>Failed to load price data. <button onClick={() => fetchData(true)} style={{ color: "#BAE6FD", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Retry</button></p>
          ) : pair ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "3rem", color: "#ffffff", letterSpacing: "-0.04em", lineHeight: 1 }}>
                {price}
              </span>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>24h</span>
                <PriceChange value={h24Change} />
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>1h</span>
                <PriceChange value={pair.priceChange?.h1 ?? 0} />
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>6h</span>
                <PriceChange value={pair.priceChange?.h6 ?? 0} />
              </div>
            </div>
          ) : null}
        </div>

        {/* Stats grid */}
        {pair && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}>
            <StatCard
              icon={<DollarSign size={14} />}
              label="Market Cap"
              value={fmt(pair.marketCap)}
              sub={<span style={{ color: "rgba(255,255,255,0.4)" }}>FDV: {fmt(pair.fdv)}</span>}
            />
            <StatCard
              icon={<BarChart3 size={14} />}
              label="24h Volume"
              value={fmt(pair.volume.h24)}
              sub={<span style={{ color: "rgba(255,255,255,0.4)" }}>1h: {fmt(pair.volume.h1)}</span>}
            />
            <StatCard
              icon={<Droplets size={14} />}
              label="Liquidity"
              value={fmt(pair.liquidity.usd)}
              sub={<span style={{ color: "rgba(255,255,255,0.4)" }}>PumpSwap pool</span>}
            />
            <StatCard
              icon={<Activity size={14} />}
              label="24h Transactions"
              value={`${(pair.txns.h24.buys + pair.txns.h24.sells).toLocaleString()}`}
              sub={
                <span>
                  <span style={{ color: "#4ADE80" }}>↑ {pair.txns.h24.buys} buys</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 0.25rem" }}>·</span>
                  <span style={{ color: "#F87171" }}>↓ {pair.txns.h24.sells} sells</span>
                </span>
              }
            />
            <StatCard
              icon={<Clock size={14} />}
              label="1h Transactions"
              value={`${(pair.txns.h1.buys + pair.txns.h1.sells).toLocaleString()}`}
              sub={
                <span>
                  <span style={{ color: "#4ADE80" }}>↑ {pair.txns.h1.buys} buys</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 0.25rem" }}>·</span>
                  <span style={{ color: "#F87171" }}>↓ {pair.txns.h1.sells} sells</span>
                </span>
              }
            />
            <StatCard
              icon={<TrendingUp size={14} />}
              label="Price (SOL)"
              value={parseFloat(pair.priceNative).toFixed(8)}
              sub={<span style={{ color: "rgba(255,255,255,0.4)" }}>COOK / SOL</span>}
            />
          </div>
        )}

        {/* Chart embed */}
        <div style={{
          borderRadius: "1.25rem",
          overflow: "hidden",
          border: "1.5px solid transparent",
          backgroundImage: "linear-gradient(#000,#000) padding-box, linear-gradient(135deg,rgba(123,47,190,0.5) 0%,rgba(37,99,235,0.35) 55%,rgba(186,230,253,0.2) 100%) border-box",
          boxShadow: "0 0 60px rgba(123,47,190,0.15), 0 0 120px rgba(37,99,235,0.08)",
          marginBottom: "2rem",
        }}>
          {/* Chart header */}
          <div style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(8,6,18,0.8)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 6px #4ADE80", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>
                COOK / SOL — Live Chart
              </span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
              Powered by GeckoTerminal
            </span>
          </div>
          <iframe
            id="geckoterminal-embed"
            title="$COOK Live Chart"
            src={GECKO_EMBED}
            frameBorder="0"
            allow="clipboard-write"
            allowFullScreen
            style={{ width: "100%", height: "520px", display: "block", background: "#000" }}
          />
        </div>

        {/* Bottom info strip */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}>
          {/* Contract addresses */}
          <div style={{
            background: "rgba(8,6,18,0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "1rem",
            padding: "1.25rem 1.5rem",
          }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "rgba(186,230,253,0.7)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 1rem" }}>
              Contract Addresses
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "0.2rem" }}>Solana (sCOOK)</div>
                <code style={{ fontSize: "0.72rem", color: "#BAE6FD", fontFamily: "'JetBrains Mono', monospace", wordBreak: "break-all" }}>
                  36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1
                </code>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "0.2rem" }}>PumpSwap Pair</div>
                <code style={{ fontSize: "0.72rem", color: "rgba(186,230,253,0.6)", fontFamily: "'JetBrains Mono', monospace", wordBreak: "break-all" }}>
                  DRaDjBfCtCCD2Kb1rzMtom3oDiGnwTu9LBgA7WA4LEzx
                </code>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div style={{
            background: "rgba(8,6,18,0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "1rem",
            padding: "1.25rem 1.5rem",
          }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "rgba(186,230,253,0.7)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 1rem" }}>
              Trade & Track
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { label: "Buy on CookieSwap", href: "https://cookieswap.fun", color: "#7B2FBE" },
                { label: "Buy on CandyShop", href: "https://swap.cookiescan.io", color: "#2563EB" },
                { label: "View on DexScreener", href: `https://dexscreener.com/solana/${PAIR_ADDRESS}`, color: "#BAE6FD" },
                { label: "View on CookieScan", href: "https://cookiescan.io", color: "rgba(255,255,255,0.5)" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    color: link.color,
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <ExternalLink size={13} /> {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Supply snapshot */}
          <div style={{
            background: "rgba(8,6,18,0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "1rem",
            padding: "1.25rem 1.5rem",
          }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "rgba(186,230,253,0.7)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 1rem" }}>
              Supply Snapshot
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { label: "Total Supply", value: "1,000,000,000 $COOK", highlight: true },
                { label: "Circulating", value: "~607,200,000 $COOK" },
                { label: "Bridge Reserve", value: "~392,800,000 $COOK" },
                { label: "Additional Mint", value: "None — fixed supply", green: true },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{row.label}</span>
                  <span style={{
                    fontSize: "0.8rem",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    color: row.green ? "#4ADE80" : row.highlight ? "#ffffff" : "rgba(255,255,255,0.7)",
                  }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
