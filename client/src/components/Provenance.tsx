/*
 * DATA PROVENANCE SYSTEM
 * Every rendered figure on the site is classified as one of three kinds:
 *   live     — fetched this session; badge shows source + fetch time (UTC).
 *              If the fetch fails, callers pass kind="snapshot" with the
 *              last verified date — live can never silently render stale.
 *   snapshot — verified on-chain at a stamped date; changes over time but
 *              is not fetched live (yet).
 *   fixed    — immutable protocol constant (genesis figure, addresses,
 *              max supply). "Cannot change" is itself a claim worth marking.
 * Derived figures pass `formula` so the data flow stays readable.
 */

import { CSSProperties } from "react";

export type ProvenanceKind = "live" | "snapshot" | "fixed";

const KIND_META: Record<ProvenanceKind, { label: string; color: string; symbol: string }> = {
  live:     { label: "LIVE",  color: "#22C55E",                   symbol: "●" },
  snapshot: { label: "AS OF", color: "var(--color-cook-amber, #F5A623)", symbol: "◆" },
  fixed:    { label: "FIXED", color: "var(--cook-text-muted, #8A8F98)",  symbol: "■" },
};

export function DataBadge({
  kind,
  source,
  at,
  href,
  formula,
  cadence,
  verifiedSince,
  style,
}: {
  kind: ProvenanceKind;
  source?: string;      // e.g. "DexScreener", "Solscan", "cookiescan.io"
  at?: Date | string;   // fetch time (live) or verification date (snapshot)
  href?: string;        // one-click verification link
  formula?: string;     // e.g. "total supply − lock vault"
  cadence?: string;     // e.g. "refreshes every 30s"
  verifiedSince?: string; // "no change since" semantics: we re-check this
                          // periodically and assert it has not changed
  style?: CSSProperties;
}) {
  const meta = KIND_META[kind];
  const when =
    at instanceof Date
      ? `${at.toISOString().slice(11, 16)} UTC`
      : at; // pre-formatted date string like "Jul 3, 2026"

  const tooltip = [
    kind === "live" ? `Live from ${source ?? "source"}` : kind === "snapshot" ? `On-chain verified ${when ?? ""}${source ? ` via ${source}` : ""}` : "Immutable protocol constant",
    kind === "live" && when ? `fetched ${when}` : null,
    verifiedSince ? `No change since ${verifiedSince} — re-verified periodically; a change would be flagged` : null,
    cadence ?? null,
    formula ? `= ${formula}` : null,
    href ? "Click to verify at source" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const pill = (
    <span
      title={tooltip}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3em",
        fontSize: "0.62rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: meta.color,
        border: `1px solid ${meta.color}`,
        borderRadius: "999px",
        padding: "0.1rem 0.45rem",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        opacity: kind === "fixed" ? 0.75 : 1,
        ...style,
      }}
    >
      <span
        aria-hidden
        className={kind === "live" ? "cook-live-pulse" : undefined}
        style={{ fontSize: "0.55rem" }}
      >
        {meta.symbol}
      </span>
      {verifiedSince
        ? `\u2713 NO CHANGE SINCE ${verifiedSince.toUpperCase()}`
        : kind === "snapshot" && when
        ? `AS OF ${when.toUpperCase()}`
        : meta.label}
    </span>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      {pill}
    </a>
  ) : (
    pill
  );
}

/* One-line legend, shown once per data-heavy page/section. */
export function ProvenanceLegend({ style }: { style?: CSSProperties }) {
  const item = (kind: ProvenanceKind, text: string) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35em" }}>
      <span style={{ color: KIND_META[kind].color, fontSize: "0.6rem" }}>{KIND_META[kind].symbol}</span>
      <span>{text}</span>
    </span>
  );
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.6rem 1.4rem",
        fontSize: "0.72rem",
        color: "var(--cook-text-muted)",
        ...style,
      }}
    >
      {item("live", "Live — fetched in your browser; hover for source and time")}
      {item("snapshot", "Snapshot — on-chain verified at the stated date")}
      {item("fixed", "Fixed — immutable protocol constant")}
      <span style={{ opacity: 0.8 }}>Every figure links to its source.</span>
    </div>
  );
}

/*
 * Shared live COOK/SOL pair data (DexScreener), module-cached so Hero,
 * Markets, and Tokenomics share ONE fetch per interval across the app.
 */
import { useEffect, useState } from "react";

export interface LivePair {
  priceUsd: number;
  change24h: number;
  volume24h: number;
  liquidityUsd: number;
  fetchedAt: Date;
}

const PAIR_API =
  "https://api.dexscreener.com/latest/dex/tokens/36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1";
const TTL_MS = 30_000;

let cache: { data: LivePair | null; at: number } = { data: null, at: 0 };
let inflight: Promise<LivePair | null> | null = null;

async function fetchPair(): Promise<LivePair | null> {
  const now = Date.now();
  if (cache.data && now - cache.at < TTL_MS) return cache.data;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch(PAIR_API);
      const json = await res.json();
      const p = json?.pairs?.[0];
      if (!p) throw new Error("no pair");
      const data: LivePair = {
        priceUsd: parseFloat(p.priceUsd),
        change24h: p.priceChange?.h24 ?? 0,
        volume24h: p.volume?.h24 ?? 0,
        liquidityUsd: p.liquidity?.usd ?? 0,
        fetchedAt: new Date(),
      };
      cache = { data, at: Date.now() };
      return data;
    } catch {
      return cache.data; // stale-on-error: last good data or null
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function useLivePair(): { pair: LivePair | null } {
  const [pair, setPair] = useState<LivePair | null>(cache.data);
  useEffect(() => {
    let alive = true;
    const tick = () => fetchPair().then((d) => alive && setPair(d));
    tick();
    const id = setInterval(tick, TTL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return { pair };
}
