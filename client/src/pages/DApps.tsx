/*
 * DAPPS EXPLORER — /dapps
 * Live previews of every ecosystem app, embedded on demand.
 *  - App list loads at runtime from the community registry (cookiechain/apps),
 *    the same source the App Explorer uses — pages can't drift out of sync.
 *    A hardcoded fallback renders if the registry is unreachable.
 *  - Iframes load ONLY on click, never all at once.
 *  - Frame-blocking sites show a fallback note; "Open app" always works.
 *  - Wallet note: extension wallets often refuse frames; open directly.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, MonitorPlay, X } from "lucide-react";
import EcosystemOrbit from "@/components/EcosystemOrbit";

const REGISTRY_URL = "https://raw.githubusercontent.com/cookiechain/apps/main/apps.json";

/* Hosts that send frame-blocking headers: skip the iframe, show the note. */
const NO_EMBED_HOSTS = ["nightly.app", "defillama.com", "metaplex.com", "cookiebox.app", "bakedbazaar.art", "api.cookiescan.io", "github.com"];
const isNoEmbed = (url: string) => { try { const h = new URL(url).host.replace(/^www\./, ""); return NO_EMBED_HOSTS.some((b) => h === b || h.endsWith("." + b)); } catch { return true; } };
const hostOf = (url: string) => { try { return new URL(url).host.replace(/^www\./, ""); } catch { return url; } };

type AppInfo = { name: string; url: string; desc: string; tag: string; noEmbed?: boolean; logo?: string };

/* Apps not (yet) in the community registry — always appended. */
const EXTRA_APPS: AppInfo[] = [
  { name: "Cookie Docs", url: "https://docs.cookiechain.wtf", desc: "Developer and user documentation.", tag: "Docs" },
];

/* Fallback if the registry is unreachable — kept in sync manually as a safety net. */
const FALLBACK_APPS: AppInfo[] = [
  { name: "CookieScan",         url: "https://cookiescan.io",            desc: "Block explorer: slots, transactions, holders, validators.", tag: "Explorer" },
  { name: "Hyperlane Bridge",   url: "https://hyperlane.cookiescan.io", desc: "Instant sCOOK / cCOOK transfers via warp route.",          tag: "Bridge" },
  { name: "CandyShop",          url: "https://swap.cookiescan.io/",      desc: "Swap aggregator on Cookie Chain.",                          tag: "DEX" },
  { name: "CookieSwap",         url: "https://cookieswap.fun/",          desc: "Native AMM DEX.",                                           tag: "DEX" },
  { name: "MomoSwap",           url: "https://www.momoswap.fun/",        desc: "Bonding-curve launchpad: mint, trade, graduate to a DEX.",  tag: "Launchpad" },
  { name: "Cookiebox",          url: "https://cookiebox.app/",           desc: "Liquidity hub: pools, fees, swaps, LP positions.",          tag: "DeFi", noEmbed: true },
  { name: "Bake Your Stake",    url: "https://bakeyourstake.xyz/",       desc: "Stake COOK to support network security and earn rewards.", tag: "Staking" },
  { name: "Cookoven",           url: "https://cookoven.xyz/",            desc: "Staking, .cook domains, and dApp hub.",                     tag: "Staking" },
  { name: "CookBook",           url: "https://book.cookoven.xyz",        desc: "Mint and manage .cook domains.",                            tag: "Domains" },
  { name: "Cookie Lock",        url: "https://lock.cookoven.xyz",        desc: "Token locks and vesting with SPL and Token-2022 support.", tag: "Infra" },
  { name: "Nightly Wallet",     url: "https://nightly.app/",             desc: "The first COOK-supported cross-chain wallet.",              tag: "Wallet", noEmbed: true },
  { name: "Morsel Wallet",      url: "https://morselwallet.app/",        desc: "Native home of Cookie Chain assets. SOL, USDC, sCOOK.",     tag: "Wallet" },
  { name: "Cookie Squad",       url: "https://sig.cookiechain.wtf",      desc: "Community multi-sig dashboard (Squads v4 on Cookie Chain).", tag: "Governance" },
  { name: "CookieScan DAS API", url: "https://api.cookiescan.io/",       desc: "Public DAS service: enriched, indexed chain data for builders.", tag: "API", noEmbed: true },
  { name: "DefiLlama",          url: "https://defillama.com/chain/cookiechain", desc: "TVL, volumes, and protocol metrics for Cookie Chain.", tag: "Analytics", noEmbed: true },
  { name: "Metaplex",           url: "https://www.metaplex.com/",        desc: "The standard for launching tokens and NFTs on the SVM.",    tag: "Infra", noEmbed: true },
  { name: "Cookie MCP",         url: "https://github.com/cookiechain/cookie-mcp", desc: "MCP server giving AI agents onchain access: trade, launch, LP, stake, bridge.", tag: "AI", noEmbed: true },
  { name: "Cookie Chat",        url: "https://cookiechat.net/",          desc: "AI assistant for Cookie Chain.",                            tag: "AI" },
  { name: "Sesamians",          url: "https://sesamians.art",            desc: "Leading NFT collection: identity and culture in the COOK ecosystem.", tag: "NFT" },
  { name: "BakedBazaar",        url: "https://bakedbazaar.art",          desc: "NFT marketplace on Cookie Chain.",                          tag: "NFT", noEmbed: true },
  { name: "GorBoy",             url: "https://www.gorboy.com",           desc: "Gaming on Cookienet.",                                      tag: "Gaming" },
  { name: "GorWeld",            url: "https://gorweld.com",              desc: "Browser welding sim with Burn Relics NFTs and the Dumpster Forge.", tag: "Gaming" },
  { name: "Cookie Docs",        url: "https://docs.cookiechain.wtf",     desc: "Developer and user documentation.",                         tag: "Docs" },
];

function AppCard({ app }: { app: AppInfo }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: "var(--cook-surface)", border: "1px solid var(--cook-border)", borderRadius: "0.75rem", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1.1rem 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          {app.logo && <img src={app.logo} alt="" width={22} height={22} style={{ borderRadius: "6px" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--cook-text-primary)" }}>{app.name}</span>
          <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-cook-amber, #F5A623)", border: "1px solid var(--color-cook-amber, #F5A623)", borderRadius: "999px", padding: "0.1rem 0.5rem" }}>{app.tag.toUpperCase()}</span>
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--cook-text-secondary)", marginTop: "0.3rem" }}>{app.desc}</div>
      </div>

      {open && app.noEmbed && (
        <div style={{ borderTop: "1px solid var(--cook-border)", height: "160px", display: "grid", placeItems: "center", background: "var(--cook-bg-2)", color: "var(--cook-text-muted)", fontSize: "0.82rem", padding: "1rem", textAlign: "center" }}>
          This app doesn't allow embedded previews — use "Open app" below.
        </div>
      )}

      {open && !app.noEmbed && (
        <div style={{ position: "relative", borderTop: "1px solid var(--cook-border)" }}>
          <iframe
            src={app.url}
            title={`${app.name} preview`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            style={{ width: "100%", height: "480px", border: 0, display: "block", background: "var(--cook-bg-2)" }}
          />
          <button onClick={() => setOpen(false)} aria-label="Close preview"
            style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "var(--cook-surface)", border: "1px solid var(--cook-border)", borderRadius: "999px", width: "28px", height: "28px", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--cook-text-secondary)" }}>
            <X size={14} />
          </button>
          <div style={{ padding: "0.5rem 1.25rem", fontSize: "0.7rem", color: "var(--cook-text-muted)", borderTop: "1px solid var(--cook-border)" }}>
            Blank preview? This app blocks embedding — use "Open app" instead. Wallet connections work best in the full app.
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.6rem", padding: "0.9rem 1.25rem", borderTop: "1px solid var(--cook-border)", marginTop: "auto" }}>
        {!open && (
          <button onClick={() => setOpen(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "transparent", border: "1px solid var(--cook-border)", borderRadius: "0.5rem", padding: "0.45rem 0.9rem", cursor: "pointer", color: "var(--cook-text-primary)", fontSize: "0.82rem", fontWeight: 600 }}>
            <MonitorPlay size={15} /> Preview here
          </button>
        )}
        <a href={app.url} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#2563EB", borderRadius: "0.5rem", padding: "0.45rem 0.9rem", color: "#fff", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
          Open app <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

export default function DApps() {
  const [apps, setApps] = useState<AppInfo[]>(FALLBACK_APPS);

  useEffect(() => {
    let cancelled = false;
    fetch(REGISTRY_URL)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((entries: { title: string; description: string; tag: string; href: string; logo?: string; live?: boolean }[]) => {
        if (cancelled || !Array.isArray(entries) || entries.length === 0) return;
        const fromRegistry: AppInfo[] = entries
          .filter((e) => e.live !== false && e.title && e.href)
          .map((e) => ({ name: e.title, url: e.href.replace("hyperlane.cookiechain.wtf", "hyperlane.cookiescan.io"), desc: e.description ?? "", tag: e.tag ?? "App", logo: e.logo, noEmbed: isNoEmbed(e.href) }));
        const seen = new Set(fromRegistry.map((a) => hostOf(a.url)));
        setApps([...fromRegistry, ...EXTRA_APPS.filter((x) => !seen.has(hostOf(x.url)))]);
      })
      .catch(() => { /* registry unreachable: fallback list stays */ });
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cook-bg)", transition: "background 0.3s ease" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 2rem 4rem" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--cook-text-secondary)", textDecoration: "none", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <EcosystemOrbit />

        <div className="section-label" style={{ marginBottom: "0.75rem" }}>Ecosystem</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em", color: "var(--cook-text-primary)", margin: "0 0 0.75rem" }}>
          Explore the dApps — live
        </h1>
        <p style={{ color: "var(--cook-text-secondary)", fontSize: "0.95rem", maxWidth: "640px", lineHeight: 1.6, marginBottom: "0.75rem" }}>
          Every app below is running on or around Cookie Chain right now. Hit "Preview here" to try one inside this page, or open it in a full tab.
        </p>
        <p style={{ color: "var(--cook-text-muted)", fontSize: "0.78rem", maxWidth: "640px", lineHeight: 1.5, marginBottom: "2.25rem" }}>
          Some apps decline to render inside other sites (a standard security setting) and will show a blank preview — the Open app button always works. For wallet connections, always use the full app.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
          {apps.map((a) => <AppCard key={a.url} app={a} />)}
        </div>
      </div>
    </div>
  );
}
