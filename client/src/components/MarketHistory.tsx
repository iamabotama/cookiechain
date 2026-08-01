/*
 * MARKET HISTORY — growth chart for the Markets page.
 *
 * Reads /stats/market-history.json (appended every 6h by the supply
 * workflow; daily candles back to genesis are backfilled from
 * GeckoTerminal on the collector's first run). Metric toggle:
 * price / 24h volume / liquidity. Backfilled rows only carry
 * price+volume, so the liquidity series begins when live collection
 * began — the empty-lead is expected, not a bug.
 */

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface Snapshot {
  t: string;
  price: number | null;
  vol24: number | null;
  liq: number | null;
  mcap: number | null;
  circ: number | null;
  chainTx: number | null;
  source: string;
}

type Metric = "price" | "vol24" | "liq";

const METRICS: { key: Metric; label: string; color: string; prefix: string }[] = [
  { key: "price", label: "Price", color: "#38BDF8", prefix: "$" },
  { key: "vol24", label: "24h Volume", color: "#4ADE80", prefix: "$" },
  { key: "liq", label: "Liquidity", color: "#FBBF24", prefix: "$" },
];

function fmtCompact(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  if (n >= 1) return n.toFixed(2);
  return n.toPrecision(3);
}

export default function MarketHistory() {
  const [snaps, setSnaps] = useState<Snapshot[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [metric, setMetric] = useState<Metric>("price");

  useEffect(() => {
    fetch("/stats/market-history.json", { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((j) => setSnaps(j.snapshots ?? []))
      .catch(() => setFailed(true));
  }, []);

  const active = METRICS.find((m) => m.key === metric)!;

  const data = useMemo(() => {
    if (!snaps) return [];
    return snaps
      .filter((s) => s[metric] !== null && s[metric] !== undefined)
      .map((s) => ({
        t: s.t,
        label: new Date(s.t).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: s[metric] as number,
      }));
  }, [snaps, metric]);

  // Hide the section entirely until history exists — no broken empty box.
  if (failed || (snaps !== null && data.length < 2)) return null;

  return (
    <div style={{
      background: "var(--cook-card-bg)",
      border: "1px solid var(--cook-card-border)",
      borderRadius: "16px",
      padding: "1.25rem 1.25rem 0.75rem",
      marginBottom: "2rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <TrendingUp size={18} color={active.color} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--cook-text-primary)", fontSize: "1rem" }}>
            Growth Since Genesis
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--cook-text-secondary)" }}>
            snapshots every 6h · daily history to May 26
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              style={{
                fontSize: "0.75rem", fontWeight: 600, padding: "0.35rem 0.75rem",
                borderRadius: "8px", cursor: "pointer",
                border: `1px solid ${metric === m.key ? m.color + "66" : "var(--cook-card-border)"}`,
                background: metric === m.key ? m.color + "14" : "transparent",
                color: metric === m.key ? m.color : "var(--cook-text-secondary)",
                transition: "all 0.2s",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={active.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={active.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--cook-card-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--cook-text-secondary)", fontSize: 11 }}
              tickLine={false} axisLine={false} minTickGap={40}
            />
            <YAxis
              tick={{ fill: "var(--cook-text-secondary)", fontSize: 11 }}
              tickLine={false} axisLine={false} width={58}
              tickFormatter={(v: number) => active.prefix + fmtCompact(v)}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--cook-card-bg)",
                border: "1px solid var(--cook-card-border)",
                borderRadius: "10px",
                fontSize: "0.8rem",
              }}
              labelStyle={{ color: "var(--cook-text-secondary)" }}
              formatter={(v: number) => [active.prefix + fmtCompact(v), active.label]}
            />
            <Area
              type="monotone" dataKey="value"
              stroke={active.color} strokeWidth={2}
              fill={`url(#grad-${metric})`}
              dot={false} activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ fontSize: "0.7rem", color: "var(--cook-text-secondary)", padding: "0.4rem 0 0.4rem" }}>
        Sources: DexScreener (live, 6h snapshots) · GeckoTerminal (daily history) · liquidity series begins with live collection
      </div>
    </div>
  );
}
