/*
 * Market history collector — $COOK
 *
 * Runs on the same 6h cron as the supply refresh (see update-supply.yml).
 * Each run appends one snapshot to client/public/stats/market-history.json:
 *   price / 24h volume / liquidity / market cap (DexScreener API)
 *   circulating / total / lock vault  (local supply.json, already refreshed
 *   earlier in the same workflow run)
 *   chain transaction count           (Cookie Chain RPC, best-effort)
 *
 * FIRST RUN ONLY: backfills daily price/volume candles from the
 * GeckoTerminal OHLCV API back to pool creation, so the growth chart has
 * history from genesis instead of starting today. Backfilled rows carry
 * source:"gt-ohlcv" and have null liquidity/supply fields.
 *
 * Fail-safe: any fetch error aborts without writing; an append only happens
 * if the newest live snapshot is >3h newer than the last one (idempotent
 * across reruns). File stays small: 4 snapshots/day ≈ a few KB per month.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "client", "public", "stats");
const HISTORY_PATH = join(OUT_DIR, "market-history.json");
const SUPPLY_PATH = join(ROOT, "client", "public", "supply", "supply.json");

const PAIR = "DRaDjBfCtCCD2Kb1rzMtom3oDiGnwTu9LBgA7WA4LEzx";
const DEX_API = `https://api.dexscreener.com/latest/dex/pairs/solana/${PAIR}`;
const GT_OHLCV = `https://api.geckoterminal.com/api/v2/networks/solana/pools/${PAIR}/ohlcv/day?limit=1000`;
const COOKIE_RPC = "https://rpc.cookiescan.io";

const MIN_GAP_MS = 3 * 60 * 60 * 1000; // don't append snapshots <3h apart

async function getJson(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function fetchPair() {
  const j = await getJson(DEX_API);
  const p = (j.pairs || []).find((x) => x.pairAddress === PAIR) || (j.pairs || [])[0] || j.pair;
  if (!p || !p.priceUsd) throw new Error("DexScreener returned no pair data — refusing to write");
  return {
    price: +p.priceUsd,
    vol24: p.volume?.h24 ?? null,
    liq: p.liquidity?.usd ?? null,
    fdv: p.fdv ?? null,
    mcap: p.marketCap ?? null,
  };
}

function readSupply() {
  try {
    const s = JSON.parse(readFileSync(SUPPLY_PATH, "utf8"));
    return {
      circ: s.circulating_supply ?? null,
      total: s.total_supply ?? null,
      vault: s.excluded_wallets?.[0]?.balance ?? null,
    };
  } catch {
    return { circ: null, total: null, vault: null };
  }
}

async function fetchChainTx() {
  // Best-effort: Cookie Chain L1 cumulative transaction count.
  try {
    const j = await getJson(COOKIE_RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getTransactionCount", params: [] }),
    });
    return typeof j.result === "number" ? j.result : null;
  } catch {
    return null;
  }
}

async function backfill() {
  // One-time seed from GeckoTerminal daily candles (close price + USD volume).
  try {
    const j = await getJson(GT_OHLCV, { headers: { accept: "application/json" } });
    const list = j?.data?.attributes?.ohlcv_list || [];
    return list
      .map(([ts, _o, _h, _l, close, vol]) => ({
        t: new Date(ts * 1000).toISOString(),
        price: close ?? null,
        vol24: vol ?? null,
        liq: null, mcap: null, fdv: null,
        circ: null, total: null, vault: null, chainTx: null,
        source: "gt-ohlcv",
      }))
      .sort((a, b) => a.t.localeCompare(b.t));
  } catch (e) {
    console.warn(`Backfill unavailable (${e.message}) — starting history from today.`);
    return [];
  }
}

let history = { schema: 1, token: "COOK", pair: PAIR, snapshots: [] };
if (existsSync(HISTORY_PATH)) {
  history = JSON.parse(readFileSync(HISTORY_PATH, "utf8"));
}

if (history.snapshots.length === 0) {
  console.log("Empty history — attempting genesis backfill from GeckoTerminal…");
  history.snapshots = await backfill();
  console.log(`Backfilled ${history.snapshots.length} daily candles.`);
}

const last = history.snapshots.filter((s) => s.source === "live").at(-1);
const now = new Date();
if (last && now - new Date(last.t) < MIN_GAP_MS) {
  console.log("Last live snapshot is <3h old — nothing to do.");
  process.exit(0);
}

const [pair, chainTx] = await Promise.all([fetchPair(), fetchChainTx()]);
const supply = readSupply();

// Sanity: refuse absurd values rather than pollute the series.
if (!(pair.price > 0 && pair.price < 1000)) {
  throw new Error(`Price ${pair.price} outside sane range — refusing to write`);
}

history.snapshots.push({
  t: now.toISOString(),
  price: pair.price,
  vol24: pair.vol24,
  liq: pair.liq,
  mcap: pair.mcap,
  fdv: pair.fdv,
  circ: supply.circ,
  total: supply.total,
  vault: supply.vault,
  chainTx,
  source: "live",
});

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(HISTORY_PATH, JSON.stringify(history) + "\n");
writeFileSync(
  join(OUT_DIR, "latest.json"),
  JSON.stringify({ updated_at: now.toISOString(), ...history.snapshots.at(-1) }, null, 2) + "\n",
);
console.log(
  `Appended live snapshot: price=$${pair.price} vol24=$${pair.vol24} liq=$${pair.liq} chainTx=${chainTx} (total ${history.snapshots.length} rows)`,
);
