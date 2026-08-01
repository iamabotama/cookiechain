/*
 * Top holders collector — $COOK (SPL, Solana)
 * Fetches the 20 largest token accounts + supply, resolves owner wallets,
 * flags the Squads lock vault (reserve) and Hyperlane escrow, and writes
 * client/public/stats/top-holders.json. Runs in the 6h workflow — doubles
 * as a permanent transparency endpoint and the Annex A data source.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "client", "public", "stats");
const MINT = "36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1";
const VAULT_OWNER = "DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx";
const HYPERLANE_ESCROW = "88q7zoKctwAQRsoTxkMJy95sNE3tntuyEhSrhvR1eZwq";
const RPCS = [
  process.env.SOLANA_RPC,
  "https://api.mainnet-beta.solana.com",
  "https://solana-rpc.publicnode.com",
  "https://solana.drpc.org",
  "https://rpc.ankr.com/solana",
].filter(Boolean);

async function rpc(method, params) {
  let lastErr;
  for (const url of RPCS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        if (j.error) throw new Error(j.error.message);
        return j.result;
      } catch (e) {
        lastErr = e;
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }
  throw new Error(`all RPCs failed for ${method}: ${lastErr?.message}`);
}

try {
const supply = (await rpc("getTokenSupply", [MINT])).value.uiAmount;
const largest = (await rpc("getTokenLargestAccounts", [MINT])).value.slice(0, 20);
const infos = (await rpc("getMultipleAccounts", [largest.map(a => a.address), { encoding: "jsonParsed" }])).value;

const holders = largest.map((a, i) => {
  const owner = infos[i]?.data?.parsed?.info?.owner ?? null;
  let label = "community";
  if (owner === VAULT_OWNER) label = "reserve_lock_vault";
  else if (owner === HYPERLANE_ESCROW || a.address === HYPERLANE_ESCROW) label = "hyperlane_escrow";
  return {
    rank: i + 1,
    token_account: a.address,
    owner,
    amount: a.uiAmount,
    pct_of_total: +(a.uiAmount / supply * 100).toFixed(4),
    label,
  };
});

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "top-holders.json"), JSON.stringify({
  updated_at: new Date().toISOString(),
  mint: MINT,
  total_supply: supply,
  holders,
}, null, 2) + "\n");
console.log(`Wrote top-holders.json: total=${supply}, top account=${holders[0].amount} (${holders[0].label})`);
} catch (e) {
  // Non-fatal: record the error where it gets committed, keep the pipeline alive.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "top-holders-error.txt"), `${new Date().toISOString()} ${e.stack || e.message}\n`);
  console.warn("top-holders failed (recorded):", e.message);
}
