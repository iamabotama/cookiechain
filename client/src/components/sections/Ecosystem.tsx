/*
 * ECOSYSTEM SECTION — theme-aware, registry-driven
 *
 * dApp cards load LIVE from the community-maintained apps registry:
 *   https://github.com/cookiechain/apps  (apps.json + logos/)
 * — the same source powering cookiechain.wtf/ecosystem, so the two sites
 * can never drift. If the fetch fails, we fall back to the embedded
 * SNAPSHOT below (verified against the registry at build time), per the
 * site-wide provenance convention. New projects: PR the registry.
 */

import { useEffect, useRef, useState } from "react";
import { LINKS } from "@/lib/links";
import { DataBadge } from "@/components/Provenance";

const REGISTRY_URL =
  "https://raw.githubusercontent.com/cookiechain/apps/main/apps.json";
const REGISTRY_REPO = "https://github.com/cookiechain/apps";

interface RegistryApp {
  title: string;
  description: string;
  tag: string;
  href: string;
  x?: string;
  logo?: string;
  live?: boolean;
}

const TAG_COLORS: Record<string, string> = {
  Infra: "#38BDF8",
  Wallet: "#A78BFA",
  DeFi: "#4ADE80",
  Meme: "#F472B6",
  NFT: "#7B2FBE",
};
const tagColor = (tag: string) => TAG_COLORS[tag] ?? "#60A5FA";

// Registry snapshot (verified Jul 13, 2026) — fallback if the live fetch fails
const REGISTRY_SNAPSHOT: RegistryApp[] = [
  {
    "title": "CookieScan",
    "description": "A clean block explorer interface for tracking COOK blocks, transactions, and accounts.",
    "tag": "Infra",
    "href": "https://cookiescan.io/",
    "x": "https://x.com/cookiescanio",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/cookiescan.png",
    "live": true
  },
  {
    "title": "Native Bridge",
    "description": "Community-built bridge infrastructure for moving assets between COOK and Solana chain.",
    "tag": "Infra",
    "href": "https://bridge.cookiescan.io/",
    "x": "https://x.com/cookiescanio",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/bridge.png",
    "live": true
  },
  {
    "title": "Nightly Wallet",
    "description": "The first COOK supported wallet. A simple, secure, and cross-chain wallet for crypto users.",
    "tag": "Wallet",
    "href": "https://nightly.app/",
    "x": "https://x.com/Nightly_app",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/nightly.png",
    "live": true
  },
  {
    "title": "DefiLlama",
    "description": "DeFi analytics dashboard tracking total value locked (TVL), volumes, and protocol metrics across Cookie Chain.",
    "tag": "Infra",
    "href": "https://defillama.com/chain/cookiechain",
    "x": "https://x.com/DefiLlama",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/defillama.png",
    "live": true
  },
  {
    "title": "Bake Your Stake",
    "description": "Stake your COOK tokens to support network security and earn rewards. Simple, secure, and built for the community.",
    "tag": "Infra",
    "href": "https://bakeyourstake.xyz/",
    "x": "https://x.com/TheCookieChain",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/bakeyourstake.png",
    "live": true
  },
  {
    "title": "CookieSwap",
    "description": "Native DeFi powerhouse for swaps, liquidity, and yield in the COOK ecosystem.",
    "tag": "DeFi",
    "href": "https://cookieswap.fun",
    "x": "https://x.com/cookieswapapp",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/cookieswap.png",
    "live": true
  },
  {
    "title": "Candy Shop",
    "description": "Aggregator of the best routes across DeFi apps on Cookie Chain.",
    "tag": "DeFi",
    "href": "https://swap.cookiescan.io",
    "x": "https://x.com/cookiescanio",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/candy.png",
    "live": true
  },
  {
    "title": "Metaplex",
    "description": "The standard for launching tokens and NFTs on Solana and the SVM.",
    "tag": "Infra",
    "href": "https://www.metaplex.com/",
    "x": "https://x.com/metaplex",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/metaplex.png",
    "live": true
  },
  {
    "title": "Cookie Quads",
    "description": "Squads v4 Multisig fork on Cookie Chain. Secure, flexible, and built for the community.",
    "tag": "Infra",
    "href": "https://sig.cookiechain.wtf/",
    "x": "https://x.com/TheCookieChain",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/quads.png",
    "live": true
  },
  {
    "title": "CookieBox",
    "description": "Liquidity Hub on Cookie Chain. Create pools, launch tokens, and claim fees.",
    "tag": "DeFi",
    "href": "https://cookiebox.app/",
    "x": "https://x.com/CookieBoxLP",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/cookiebox.png",
    "live": true
  },
  {
    "title": "CookieScan DAS API",
    "description": "Public DAS Service for COOK. Provides enriched, indexed blockchain data for developers and projects building on the ecosystem.",
    "tag": "Infra",
    "href": "https://api.cookiescan.io/",
    "x": "https://x.com/cookiescanio",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/das.png",
    "live": true
  },
  {
    "title": "Bang",
    "description": "A token launchpad for degens, communities, and builders to create and distribute tokens on COOK.",
    "tag": "DeFi",
    "href": "https://banggor.com/",
    "x": null,
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/bang.png",
    "live": false
  },
  {
    "title": "Morsel Wallet",
    "description": "The native home of Cookie Chain assets. Collect, trade, and explore the ecosystem at full speed. SOL, USDC and sCOOK included.",
    "tag": "Wallet",
    "href": "https://morselwallet.app/",
    "x": "https://x.com/MorselWallet",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/morsel.png",
    "live": false
  },
  {
    "title": "CookOven",
    "description": "The hub for dApps on Cookie Chain. Discover domains, locking, marketplaces and the next generation of web3 tools, all in one place.",
    "tag": "DeFi",
    "href": "https://cookoven.xyz",
    "x": "https://x.com/CookOvenApps",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/cookoven.png",
    "live": true
  },
  {
    "title": "CookBook",
    "description": "CookBook is the on-chain domain platform for Cookie Chain. Users can mint their own .cook domain, manage their domains, transfer domains to another wallet, and set a primary domain.",
    "tag": "Infra",
    "href": "https://book.cookoven.xyz",
    "x": "https://x.com/CookOvenApps",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/cookBook.png",
    "live": true
  },
  {
    "title": "Cookie Lock",
    "description": "Cookie Vault brings token locks and vesting to Cookie Chain with full SPL & Token-2022 support.",
    "tag": "Infra",
    "href": "https://lock.cookoven.xyz",
    "x": "https://x.com/CookOvenApps",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/cooklock.png",
    "live": true
  },
  {
    "title": "GORBOY",
    "description": "Gamified meme token on Cookie Chain. A fun and community-driven project exploring the lighter side of the COOK ecosystem.",
    "tag": "Meme",
    "href": "https://gorboy.com",
    "x": "https://x.com/GORBOY_OFFICIAL",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/gorboy.png",
    "live": true
  },
  {
    "title": "Sesamians",
    "description": "Leading NFT Collection on Cookie Chain. A community-driven project exploring identity and culture in the COOK ecosystem.",
    "tag": "NFT",
    "href": "https://sesamians.art",
    "x": null,
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/sesamians.png",
    "live": true
  },
  {
    "title": "Baked Bazaar",
    "description": "NFT marketplace on Cookie Chain. Trade, collect, and celebrate with the Cookie Chain community.",
    "tag": "NFT",
    "href": "https://bakedbazaar.art/",
    "x": "https://x.com/bakedbazaarArt",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/bakedbazaar.png",
    "live": true
  },
  {
    "title": "GorWeld",
    "description": "Welder-built browser welding sim — MIG/TIG/MMA plus oxy & plasma cutting — with Burn Relics NFTs and the Dumpster Forge. $GORWELDD rewards coming.",
    "tag": "Meme",
    "href": "https://gorweld.com",
    "x": "https://x.com/GorWeld",
    "logo": "https://raw.githubusercontent.com/cookiechain/apps/main/logos/gorweld.png",
    "live": false
  }
];

const COMMUNITY_LINKS = [
  { label: "X / Twitter", href: LINKS.twitter, icon: "𝕏" },
  { label: "Telegram", href: LINKS.telegram, icon: "✈️" },
  { label: "GitHub", href: LINKS.github, icon: "⌥" },
  { label: "Docs", href: LINKS.docs, icon: "📖" },
  { label: "Whitepaper", href: LINKS.whitepaper, icon: "📄" },
  { label: "Community Site", href: LINKS.community_site, icon: "🍪" },
];

export default function Ecosystem() {
  const [visible, setVisible] = useState(false);
  const [apps, setApps] = useState<RegistryApp[]>(REGISTRY_SNAPSHOT);
  const [isLive, setIsLive] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch(REGISTRY_URL)
      .then((r) => r.json())
      .then((data: RegistryApp[]) => {
        if (Array.isArray(data) && data.length > 0 && data[0]?.title) {
          setApps(data);
          setIsLive(true);
          setFetchedAt(new Date());
        }
      })
      .catch(() => {/* snapshot stays */});
  }, []);

  const tags = ["All", ...Array.from(new Set(apps.map((a) => a.tag)))];
  const shown = filter === "All" ? apps : apps.filter((a) => a.tag === filter);

  return (
    <section
      id="ecosystem"
      ref={ref}
      style={{ background: "var(--cook-bg-2)", padding: "6rem 0", transition: "background 0.3s ease" }}
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "flex-end",
            marginBottom: "2rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="flex-col-mobile"
        >
          <div>
            <div className="section-label" style={{ marginBottom: "1rem" }}>Ecosystem</div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "var(--cook-text-primary)",
              lineHeight: 1.1,
            }}>
              Build on the chain<br />
              <span style={{
                background: "linear-gradient(135deg, #7B2FBE 0%, #2563EB 55%, #38BDF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                the community owns.
              </span>
            </h2>
          </div>
          <div>
            <p style={{ color: "var(--cook-text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>
              Cookie Chain's SVM compatibility means any Solana developer can deploy here with
              minimal changes. Every project below comes from the community-maintained apps
              registry — the same live source powering cookiechain.wtf.
            </p>
            <DataBadge
              kind={isLive ? "live" : "snapshot"}
              source="cookiechain/apps registry"
              at={isLive && fetchedAt ? fetchedAt : "Jul 13, 2026"}
              href={REGISTRY_REPO}
              cadence={isLive ? "fetched on page load" : undefined}
            />
          </div>
        </div>

        {/* Tag filter chips */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem",
          opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.1s",
        }}>
          {tags.map((t) => {
            const active = filter === t;
            const color = t === "All" ? "#60A5FA" : tagColor(t);
            const count = t === "All" ? apps.length : apps.filter((a) => a.tag === t).length;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  padding: "0.35rem 0.8rem",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  color: active ? color : "var(--cook-text-secondary)",
                  background: active ? `${color}18` : "var(--cook-card-bg)",
                  border: `1px solid ${active ? `${color}55` : "var(--cook-border)"}`,
                  transition: "all 0.2s ease",
                }}
              >
                {t} · {count}
              </button>
            );
          })}
        </div>

        {/* dApp cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "4rem",
        }}>
          {shown.map((app, i) => {
            const color = tagColor(app.tag);
            return (
              <a
                key={app.title}
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cook-card"
                style={{
                  padding: "1.5rem",
                  textDecoration: "none",
                  display: "block",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s ease ${0.05 + Math.min(i, 12) * 0.05}s, transform 0.5s ease ${0.05 + Math.min(i, 12) * 0.05}s`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "0.5rem",
                    overflow: "hidden", background: "var(--cook-logo-bg)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <img
                      src={app.logo}
                      alt={app.title}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    color,
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.25rem",
                    letterSpacing: "0.08em",
                  }}>
                    {app.tag.toUpperCase()}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--cook-text-primary)",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                }}>
                  {app.title}
                  <span title={app.live ? "Live" : "Coming soon"} style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: app.live ? "#4ADE80" : "#FBBF24",
                    boxShadow: `0 0 6px ${app.live ? "#4ADE8088" : "#FBBF2488"}`,
                    flexShrink: 0,
                  }} />
                </h3>
                <p style={{ fontSize: "0.775rem", color: "var(--cook-text-secondary)", lineHeight: 1.6 }}>
                  {app.description}
                </p>
                <div style={{ marginTop: "1rem", fontSize: "0.75rem", color, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Visit {app.title} ↗</span>
                  {app.x && (
                    <span
                      role="link"
                      title="View on X"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(app.x, "_blank", "noopener"); }}
                      style={{ color: "var(--cook-text-muted)", cursor: "pointer", fontWeight: 700 }}
                    >𝕏</span>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {/* Submit your project */}
        <p style={{
          fontSize: "0.85rem", color: "var(--cook-text-muted)", marginTop: "-2.5rem", marginBottom: "3.5rem",
          opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.4s",
        }}>
          Building on Cookie Chain?{" "}
          <a href={REGISTRY_REPO} target="_blank" rel="noopener noreferrer" style={{ color: "#38BDF8", textDecoration: "none" }}>
            Add your project to the registry ↗
          </a>{" "}
          — one PR lists you here and on cookiechain.wtf.
        </p>

        {/* Community links */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
        }}>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "var(--cook-text-primary)",
            marginBottom: "1.5rem",
          }}>
            Join the community
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {COMMUNITY_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.1rem",
                  background: "var(--cook-card-bg)",
                  border: "1px solid var(--cook-border)",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  color: "var(--cook-text-secondary)",
                  fontSize: "0.85rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(37,99,235,0.45)";
                  el.style.color = "var(--cook-text-primary)";
                  el.style.background = "rgba(37,99,235,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--cook-border)";
                  el.style.color = "var(--cook-text-secondary)";
                  el.style.background = "var(--cook-card-bg)";
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .flex-col-mobile { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
