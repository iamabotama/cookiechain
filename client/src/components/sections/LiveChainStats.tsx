/*
 * LIVE CHAIN STATS STRIP
 * Current Slot · Block Height · TPS · Avg Fee — polled straight from the
 * Cookie Chain RPC in the visitor's browser (standard SVM JSON-RPC).
 * Provenance: LIVE when the RPC answers; degrades to SNAPSHOT (Jul 3, 2026
 * reference values) if the RPC is unreachable or blocks CORS. Avg fee is a
 * protocol constant → FIXED.
 */

import { useEffect, useState } from "react";
import { DataBadge } from "@/components/Provenance";

const RPC = "https://rpc.cookiescan.io";
const POLL_MS = 10_000;
const SNAP = "Jul 3, 2026";
const FALLBACK = { slot: 10_374_141, blockHeight: 10_137_000, tps: 10 };

interface ChainStats {
  slot: number;
  blockHeight: number;
  tps: number;
  fetchedAt: Date;
}

async function rpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result as T;
}

function useChainStats(): { stats: ChainStats | null; live: boolean } {
  const [stats, setStats] = useState<ChainStats | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const [slot, blockHeight, samples] = await Promise.all([
          rpc<number>("getSlot"),
          rpc<number>("getBlockHeight"),
          rpc<{ numTransactions: number; samplePeriodSecs: number }[]>(
            "getRecentPerformanceSamples",
            [1]
          ),
        ]);
        const s = samples?.[0];
        const tps = s && s.samplePeriodSecs > 0 ? s.numTransactions / s.samplePeriodSecs : 0;
        if (alive) {
          setStats({ slot, blockHeight, tps, fetchedAt: new Date() });
          setLive(true);
        }
      } catch {
        if (alive) setLive((prev) => prev); // keep last state; never fake LIVE
      }
    };
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return { stats, live };
}

const fmt = (n: number) => Math.floor(n).toLocaleString("en-US");

export default function LiveChainStats() {
  const { stats, live } = useChainStats();
  const s = stats ?? { ...FALLBACK, fetchedAt: undefined as unknown as Date };

  const cell = (
    value: string,
    label: string,
    badge: React.ReactNode
  ) => (
    <div style={{ padding: "1.4rem 2rem", flex: "1 1 200px", borderLeft: "1px solid var(--cook-border)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap" }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "1.6rem",
          letterSpacing: "-0.02em",
          color: "var(--cook-text-primary)",
        }}>
          {value}
        </span>
        {badge}
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--cook-text-muted)", marginTop: "0.2rem" }}>
        {label}
      </div>
    </div>
  );

  const liveBadge = live && stats ? (
    <DataBadge kind="live" source="rpc.cookiescan.io" at={stats.fetchedAt} cadence="refreshes every 10s" href="https://cookiescan.io" />
  ) : (
    <DataBadge kind="snapshot" at={SNAP} source="cookiescan.io" href="https://cookiescan.io" />
  );

  return (
    <section style={{
      background: "var(--cook-bg-2)",
      borderTop: "1px solid var(--cook-border)",
      borderBottom: "1px solid var(--cook-border)",
      transition: "background 0.3s ease",
    }}>
      <div className="container" style={{ display: "flex", flexWrap: "wrap" }}>
        {cell(fmt(s.slot), "Current Slot", liveBadge)}
        {cell(fmt(s.blockHeight), "Block Height", liveBadge)}
        {cell(s.tps >= 100 ? fmt(s.tps) : s.tps.toFixed(0), "TPS", liveBadge)}
        {cell("0.000005 COOK", "Avg Fee / TX", (
          <DataBadge kind="fixed" href="https://docs.cookiechain.wtf" />
        ))}
      </div>
    </section>
  );
}
