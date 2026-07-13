/*
 * BRIDGE RESERVES — LIVE
 * Point-in-time reserve balances, distinct from Cookiescan's cumulative
 * flow analytics (which we link to, provider-attributed).
 *
 * Chain-side (cCOOK) balances come LIVE from rpc.cookiescan.io getBalance
 * (browser CORS already proven by the Hero stats bar). Solana-side lock
 * vault stays a verified SNAPSHOT until the stats service goes live
 * (public Solana RPC is too rate-limited for per-visitor reads).
 * Native-unit scaling is derived, not assumed: divisor chosen so the
 * balance lands in the sane 0..1.1B range (decimals on the native side
 * are intentionally not asserted anywhere in our docs).
 */

import { useEffect, useState } from "react";
import { DataBadge } from "@/components/Provenance";

const RPC = "https://rpc.cookiescan.io";
const POLL_MS = 60_000;

const CHAIN_WALLETS = [
  { key: "vault0",    label: "Vault 0 — Bridge Vault",        addr: "G3mm95M4ns7mk8oseWGJnirvgyMahMz3vZEUhdJn8oGX" },
  { key: "hyperlane", label: "Hyperlane Pool (Cookie Chain)", addr: "CL2JoQ5jdTpRNKshWhaTihuooT4qrKdLUiPsqKj3yAKz" },
  { key: "legacy",    label: "Legacy Escrow (deprecated)",    addr: "BTUTiNcsrYFCsmAxQN4diwp7JT8cobthygR4vV5bnr2D" },
];

const SOLANA_SNAPSHOT = {
  label: "Solana Lock Vault (Squads)",
  addr: "DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx",
  value: "415,697,219.14",
  asOf: "Jul 3, 2026",
};

const COOKIESCAN_BRIDGE_URL = "https://cookiescan.io/";

function scaleNative(raw: number): number {
  // pick the divisor that lands in a sane token range
  for (const d of [1e9, 1e6, 1]) {
    const v = raw / d;
    if (v > 0 && v <= 1.1e9) return v;
  }
  return raw;
}

export default function BridgeReserves() {
  const [balances, setBalances] = useState<Record<string, number> | null>(null);
  const [at, setAt] = useState<Date | null>(null);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const results = await Promise.all(
          CHAIN_WALLETS.map((w) =>
            fetch(RPC, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [w.addr] }),
            })
              .then((r) => r.json())
              .then((j) => scaleNative(j?.result?.value ?? 0))
          )
        );
        if (!alive) return;
        const next: Record<string, number> = {};
        CHAIN_WALLETS.forEach((w, i) => (next[w.key] = results[i]));
        setBalances(next);
        setAt(new Date());
      } catch {
        /* keep last state; badges fall back to snapshot */
      }
    };
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: 2 });

  const row = (label: string, addr: string, value: string, badge: React.ReactNode) => (
    <div key={addr} style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      gap: "1rem", flexWrap: "wrap", padding: "0.75rem 0",
      borderBottom: "1px solid var(--cook-border)",
    }}>
      <div>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--cook-text-primary)" }}>{label}</div>
        <a
          href={label.includes("Solana") ? `https://solscan.io/account/${addr}` : `https://cookiescan.io/address/${addr}`}
          target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "0.68rem", fontFamily: "ui-monospace, monospace", color: "var(--cook-text-muted)", textDecoration: "none" }}
        >
          {addr.slice(0, 6)}…{addr.slice(-4)} ↗
        </a>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--cook-text-primary)" }}>
          {value}
        </span>
        {badge}
      </div>
    </div>
  );

  return (
    <div style={{
      marginTop: "3rem",
      background: "var(--cook-surface)",
      border: "1px solid var(--cook-border)",
      borderRadius: "0.75rem",
      padding: "1.5rem 1.75rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--cook-text-primary)", margin: 0 }}>
          Bridge Reserves — right now
        </h3>
        <span style={{ fontSize: "0.72rem", color: "var(--cook-text-muted)" }}>
          Point-in-time balances, not cumulative flow
        </span>
      </div>

      {CHAIN_WALLETS.map((w) =>
        row(
          w.label,
          w.addr,
          balances ? `${fmt(balances[w.key])} cCOOK` : "—",
          balances && at ? (
            <DataBadge kind="live" source="rpc.cookiescan.io" at={at} cadence="refreshes every 60s" href={`https://cookiescan.io/address/${w.addr}`} />
          ) : (
            <DataBadge kind="snapshot" at="Jul 3, 2026" source="cookiescan.io" href={`https://cookiescan.io/address/${w.addr}`} />
          )
        )
      )}
      {row(
        SOLANA_SNAPSHOT.label,
        SOLANA_SNAPSHOT.addr,
        `${SOLANA_SNAPSHOT.value} sCOOK`,
        <DataBadge kind="snapshot" at={SOLANA_SNAPSHOT.asOf} source="Solscan" href={`https://solscan.io/account/${SOLANA_SNAPSHOT.addr}`} />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", paddingTop: "0.9rem" }}>
        <a href={COOKIESCAN_BRIDGE_URL} target="_blank" rel="noopener noreferrer"
           style={{ fontSize: "0.85rem", color: "#60A5FA", textDecoration: "none", fontWeight: 600 }}>
          Full bridge flow analytics on Cookiescan ↗
        </a>
        <span style={{ fontSize: "0.7rem", color: "var(--cook-text-muted)" }}>
          Flow history data provided by Cookiescan
        </span>
      </div>
    </div>
  );
}
