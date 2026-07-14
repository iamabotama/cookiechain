/*
 * COOKIE CHAIN — SUPPLY TRANSPARENCY PAGE — theme-aware
 *
 * The canonical, on-chain-verifiable statement of $COOK supply:
 * what's circulating, what's excluded and why, and the machine-readable
 * endpoints aggregators (CMC / CoinGecko) consume.
 *
 * Figures load from /supply/supply.json, which is refreshed every 6h by
 * .github/workflows/update-supply.yml via a single Solana RPC read of
 * the bridge lock vault (per-visitor RPC reads are rate-limited; same
 * reasoning as BridgeReserves).
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, Lock, Coins, PieChart, FileJson } from "lucide-react";
import { DataBadge } from "@/components/Provenance";

const COOKIE_LOGO = "/cookie-logo.webp";
const VAULT = "DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx";
const MINT = "36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1";

interface SupplyData {
  total_supply: number;
  circulating_supply: number;
  excluded_wallets: {
    address: string;
    label: string;
    balance: number;
    reason: string;
    links: { solscan: string; squads: string };
  }[];
  updated_at: string;
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 2 });

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch {
    return iso;
  }
};

const card: React.CSSProperties = {
  background: "var(--cook-card-bg)",
  border: "1px solid var(--cook-card-border)",
  borderRadius: "16px",
  padding: "1.5rem",
};

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  fontSize: "0.8rem",
  wordBreak: "break-all",
};

export default function Supply() {
  const [data, setData] = useState<SupplyData | null>(null);

  useEffect(() => {
    fetch("/supply/supply.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {/* cards fall back to em-dashes */});
  }, []);

  const total = data?.total_supply ?? 1_000_000_000;
  const circ = data?.circulating_supply;
  const vault = data?.excluded_wallets?.[0];
  const asOf = data ? fmtDate(data.updated_at) : undefined;

  return (
    <div style={{ minHeight: "100vh", background: "var(--cook-bg)", fontFamily: "'DM Sans', sans-serif", transition: "background 0.3s ease" }}>

      {/* Sticky nav bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--cook-nav-scrolled)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--cook-nav-border)",
        padding: "0 2rem", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--cook-text-secondary)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#38BDF8")}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "var(--cook-text-secondary)")}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src={COOKIE_LOGO} alt="Cookie Chain" style={{ width: "24px", height: "24px", borderRadius: "50%", filter: "drop-shadow(0 0 6px rgba(37,99,235,0.5))" }} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "var(--cook-text-primary)", letterSpacing: "0.04em" }}>
            SUPPLY TRANSPARENCY
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2rem", fontWeight: 700, color: "var(--cook-text-primary)", marginBottom: "0.75rem" }}>
          $COOK Supply, On-Chain and Verifiable
        </h1>
        <p style={{ color: "var(--cook-text-secondary)", maxWidth: "760px", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Different sites show different market caps for $COOK because they use different
          supply bases. This page is the canonical statement: every number below is derived
          from on-chain balances, refreshed automatically, and independently checkable in
          one click.
        </p>

        {/* Headline figures */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#38BDF8", marginBottom: "0.5rem" }}>
              <Coins size={18} /><span style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em" }}>TOTAL SUPPLY</span>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--cook-text-primary)" }}>
              {fmt(total)}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <DataBadge kind="fixed" formula="fixed forever — no minting authority" />
            </div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4ADE80", marginBottom: "0.5rem" }}>
              <PieChart size={18} /><span style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em" }}>CIRCULATING SUPPLY</span>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--cook-text-primary)" }}>
              {circ != null ? fmt(circ) : "—"}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <DataBadge kind="snapshot" source="Solana RPC" at={asOf}
                formula="total supply − bridge lock vault"
                cadence="auto-refreshes every 6h" />
            </div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#A78BFA", marginBottom: "0.5rem" }}>
              <Lock size={18} /><span style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em" }}>LOCKED IN BRIDGE VAULT</span>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--cook-text-primary)" }}>
              {vault ? fmt(vault.balance) : "—"}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <DataBadge kind="snapshot" source="Solscan" at={asOf}
                href={`https://solscan.io/account/${VAULT}`}
                cadence="auto-refreshes every 6h" />
            </div>
          </div>
        </div>

        {/* Excluded wallet */}
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--cook-text-primary)", marginBottom: "1rem" }}>
          Excluded from Circulating Supply
        </h2>
        <div style={{ ...card, marginBottom: "3rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
            <div>
              <div style={{ fontWeight: 700, color: "var(--cook-text-primary)", marginBottom: "0.35rem" }}>
                Cookie Chain Bridge Lock Vault <span style={{ color: "var(--cook-text-muted)", fontWeight: 400 }}>(Squads multisig)</span>
              </div>
              <div style={{ ...mono, color: "var(--cook-text-secondary)" }}>{VAULT}</div>
            </div>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
              <a href={`https://solscan.io/account/${VAULT}`} target="_blank" rel="noopener noreferrer"
                style={{ color: "#38BDF8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Solscan <ExternalLink size={13} />
              </a>
              <a href={`https://app.squads.so/squads/${VAULT}/home`} target="_blank" rel="noopener noreferrer"
                style={{ color: "#A78BFA", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Squads <ExternalLink size={13} />
              </a>
            </div>
          </div>
          <p style={{ color: "var(--cook-text-secondary)", lineHeight: 1.7, marginTop: "1rem", marginBottom: 0 }}>
            This vault holds SPL $COOK locked on Solana to back cCOOK circulating natively on
            Cookie Chain L1 — every locked token here corresponds to a token living on the
            chain, not sell-side supply on Solana. Explorers that flag "single holder
            concentration" are seeing this vault: it is the bridge escrow, held by the
            community Squads multisig, and it is excluded from circulating supply for exactly
            that reason. GeckoTerminal applies the same exclusion, which is why its market
            cap differs from sites that display fully-diluted valuation.
          </p>
        </div>

        {/* Methodology + endpoints */}
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--cook-text-primary)", marginBottom: "1rem" }}>
          Machine-Readable Endpoints
        </h2>
        <div style={{ ...card }}>
          <p style={{ color: "var(--cook-text-secondary)", lineHeight: 1.7, marginTop: 0 }}>
            Aggregators (CoinMarketCap, CoinGecko) can consume these URLs directly. Plain-text
            endpoints return a single number; the JSON endpoint includes the excluded-wallet
            breakdown and refresh timestamp. Figures update automatically every 6 hours from a
            direct Solana RPC read — a failed read never overwrites good data.
          </p>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {["total.txt", "circulating.txt", "supply.json"].map((f) => (
              <a key={f} href={`/supply/${f}`} target="_blank" rel="noopener noreferrer"
                style={{ ...mono, color: "#38BDF8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <FileJson size={14} /> https://invest.cookiechain.wtf/supply/{f}
              </a>
            ))}
          </div>
          <p style={{ ...mono, color: "var(--cook-text-muted)", marginTop: "1.25rem", marginBottom: 0 }}>
            mint: {MINT}
          </p>
        </div>

        <p style={{ color: "var(--cook-text-muted)", fontSize: "0.8rem", marginTop: "2.5rem" }}>
          Not financial advice. DYOR — every figure above links to its on-chain source.
        </p>
      </div>
    </div>
  );
}
