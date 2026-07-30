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
 * Circulating = on-chain total supply (live getTokenSupply; ~39,754 was
 * burned at launch, so total < the 1B initial mint) minus SPL COOK held by the Squads
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
const MAX_SUPPLY = 1_000_000_000; // initial mint; minting disabled. On-chain total is read live (launch burn ~39,754).

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

async function fetchTotalSupply() {
  const result = await rpc("getTokenSupply", [COOK_MINT]);
  const ui = result?.value?.uiAmount;
  if (typeof ui !== "number" || !(ui > 0)) {
    throw new Error("getTokenSupply returned no uiAmount — refusing to publish");
  }
  return ui;
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

function sanity(total, locked) {
  // Total: at most the 1B initial mint, and burns should stay a tiny fraction of it.
  if (!(total > MAX_SUPPLY * 0.99 && total <= MAX_SUPPLY)) {
    throw new Error(`Total supply ${total} outside sane range — refusing to publish`);
  }
  if (!(locked > 0 && locked < total)) {
    throw new Error(`Locked balance ${locked} outside sane range — refusing to publish`);
  }
}

const totalSupply = await fetchTotalSupply();
const locked = await fetchVaultBalance();
sanity(totalSupply, locked);
const total = +totalSupply.toFixed(2);
const circulating = +(totalSupply - locked).toFixed(2);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "total.txt"), String(total) + "\n");
writeFileSync(join(OUT_DIR, "circulating.txt"), String(circulating) + "\n");
writeFileSync(
  join(OUT_DIR, "supply.json"),
  JSON.stringify(
    {
      token: "COOK",
      mint: COOK_MINT,
      max_supply: MAX_SUPPLY,
      total_supply: total,
      burned: +(MAX_SUPPLY - total).toFixed(2),
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
        "circulating = on-chain total supply (getTokenSupply) - bridge lock vault balance, both live on-chain reads. Matches the methodology CoinGecko/GeckoTerminal apply.",
      updated_at: new Date().toISOString(),
    },
    null,
    2,
  ) + "\n",
);

console.log(`total=${total} locked=${locked.toFixed(2)} circulating=${circulating}`);
