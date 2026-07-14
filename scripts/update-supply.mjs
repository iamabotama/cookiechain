#!/usr/bin/env node
/*
 * SUPPLY ENDPOINT UPDATER
 *
 * Runs in GitHub Actions on a schedule (not per-visitor — public Solana
 * RPC is too rate-limited for browser reads, same reasoning as the
 * BridgeReserves snapshot). Queries the Solana lock vault's $COOK
 * balance once, computes circulating supply, and writes the static
 * aggregator endpoints served at:
 *
 *   /supply/total.txt        -> plain number (CMC/CG "total supply" URL)
 *   /supply/circulating.txt  -> plain number (CMC/CG "circulating supply" URL)
 *   /supply/supply.json      -> full detail w/ excluded wallets + timestamp
 *
 * Circulating = total (1B, fixed) minus SPL COOK held by the Squads
 * bridge lock vault. Locked tokens back cCOOK circulating natively on
 * Cookie Chain, so they are excluded on the Solana side — the same
 * methodology GeckoTerminal applies.
 *
 * Exits non-zero on RPC failure WITHOUT writing files, so a bad run
 * never publishes bad numbers (the previous files simply remain live).
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RPC = process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com";
const COOK_MINT = "36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1";
const LOCK_VAULT = "DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx";
const TOTAL_SUPPLY = 1_000_000_000;

const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..", "client", "public", "supply",
);

async function rpc(method, params) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`RPC error: ${JSON.stringify(json.error)}`);
  return json.result;
}

async function fetchVaultBalance() {
  const result = await rpc("getTokenAccountsByOwner", [
    LOCK_VAULT,
    { mint: COOK_MINT },
    { encoding: "jsonParsed" },
  ]);
  const accounts = result?.value ?? [];
  let total = 0;
  for (const acc of accounts) {
    const ui = acc?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
    if (typeof ui === "number") total += ui;
  }
  if (accounts.length === 0) {
    throw new Error("Vault has no COOK token accounts — refusing to publish");
  }
  return total;
}

function sanity(locked) {
  if (!(locked > 0 && locked < TOTAL_SUPPLY)) {
    throw new Error(`Locked balance ${locked} outside sane range — refusing to publish`);
  }
}

const locked = await fetchVaultBalance();
sanity(locked);
const circulating = +(TOTAL_SUPPLY - locked).toFixed(2);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "total.txt"), String(TOTAL_SUPPLY) + "\n");
writeFileSync(join(OUT_DIR, "circulating.txt"), String(circulating) + "\n");
writeFileSync(
  join(OUT_DIR, "supply.json"),
  JSON.stringify(
    {
      token: "COOK",
      mint: COOK_MINT,
      total_supply: TOTAL_SUPPLY,
      circulating_supply: circulating,
      excluded_wallets: [
        {
          address: LOCK_VAULT,
          label: "Cookie Chain Bridge Lock Vault (Squads multisig)",
          balance: +locked.toFixed(2),
          reason:
            "SPL COOK locked to back cCOOK circulating natively on Cookie Chain L1. Not freely tradable on Solana.",
          links: {
            solscan: `https://solscan.io/account/${LOCK_VAULT}`,
            squads: `https://app.squads.so/squads/${LOCK_VAULT}/home`,
          },
        },
      ],
      methodology:
        "circulating = total_supply - bridge lock vault balance (live on-chain read). Matches GeckoTerminal's exclusion.",
      updated_at: new Date().toISOString(),
    },
    null,
    2,
  ) + "\n",
);

console.log(`locked=${locked.toFixed(2)} circulating=${circulating}`);
