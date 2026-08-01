/*
 * Socials collector — $COOK community metrics via Firecrawl
 *
 * Runs in the same 6h workflow as supply + market history. Scrapes:
 *   - X followers:        x.com/TheCookieChain
 *   - Telegram members:   t.me/TheCookieNetChain (public preview page)
 *
 * Requires FIRECRAWL_API_KEY in the environment (GitHub Actions secret —
 * never commit the key). If the key is absent, the script exits cleanly so
 * local runs and forks don't break.
 *
 * Design notes:
 *   - Best-effort per source: X actively resists scraping, so a null there
 *     is expected sometimes; we record what we get and never fail the
 *     workflow over socials.
 *   - Counts are parsed from page markdown ("12,345 Followers",
 *     "1 234 members"); K/M suffixes handled.
 *   - Appends to client/public/stats/socials-history.json at most once
 *     per 5h (idempotent across reruns), and refreshes stats/socials.json
 *     with the latest values for easy embedding.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "client", "public", "stats");
const HISTORY_PATH = join(OUT_DIR, "socials-history.json");

const KEY = process.env.FIRECRAWL_API_KEY;
if (!KEY) {
  console.log("FIRECRAWL_API_KEY not set — skipping socials collection.");
  process.exit(0);
}

const X_URL = "https://x.com/TheCookieChain";
const TG_URL = "https://t.me/TheCookieNetChain";
const MIN_GAP_MS = 5 * 60 * 60 * 1000;

async function firecrawlScrape(url) {
  for (const endpoint of ["https://api.firecrawl.dev/v2/scrape", "https://api.firecrawl.dev/v1/scrape"]) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ url, formats: ["markdown"] }),
      });
      if (res.status === 404) continue; // try older API version
      const j = await res.json();
      if (!res.ok || j.success === false) {
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      return j.data?.markdown ?? j.markdown ?? "";
    } catch (e) {
      if (endpoint.includes("/v1/")) throw e;
    }
  }
  throw new Error("no Firecrawl endpoint responded");
}

function parseCount(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/[\s\u00a0\u202f,]/g, "").toUpperCase();
  const m = cleaned.match(/^([\d.]+)([KM]?)$/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  if (m[2] === "K") n *= 1e3;
  if (m[2] === "M") n *= 1e6;
  return Math.round(n);
}

async function getXFollowers() {
  try {
    const md = await firecrawlScrape(X_URL);
    const m = md.match(/([\d.,\u00a0\u202f\sKM]+?)\s*Followers/i);
    const n = parseCount(m?.[1]?.trim());
    console.log(`X followers: ${n ?? "not found in page"}`);
    return n;
  } catch (e) {
    console.warn(`X scrape failed (${e.message}) — recording null.`);
    return null;
  }
}

async function getTgMembers() {
  try {
    const md = await firecrawlScrape(TG_URL);
    const m = md.match(/([\d.,\u00a0\u202f\sKM]+?)\s*(members|subscribers)/i);
    const n = parseCount(m?.[1]?.trim());
    console.log(`Telegram ${m?.[2] ?? "members"}: ${n ?? "not found in page"}`);
    return n;
  } catch (e) {
    console.warn(`Telegram scrape failed (${e.message}) — recording null.`);
    return null;
  }
}

let history = { schema: 1, sources: { x: X_URL, telegram: TG_URL }, snapshots: [] };
if (existsSync(HISTORY_PATH)) {
  history = JSON.parse(readFileSync(HISTORY_PATH, "utf8"));
}

const last = history.snapshots.at(-1);
const now = new Date();
if (last && now - new Date(last.t) < MIN_GAP_MS) {
  console.log("Last socials snapshot is <5h old — nothing to do.");
  process.exit(0);
}

const [xFollowers, tgMembers] = await Promise.all([getXFollowers(), getTgMembers()]);

if (xFollowers === null && tgMembers === null) {
  console.warn("Both sources returned nothing — not appending an empty row.");
  process.exit(0);
}

history.snapshots.push({ t: now.toISOString(), xFollowers, tgMembers });
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(HISTORY_PATH, JSON.stringify(history) + "\n");
writeFileSync(
  join(OUT_DIR, "socials.json"),
  JSON.stringify({ updated_at: now.toISOString(), x_followers: xFollowers, tg_members: tgMembers }, null, 2) + "\n",
);
console.log(`Appended socials snapshot (${history.snapshots.length} total).`);
