/*
 * DAPPS EXPLORER — /dapps
 * Live previews of every ecosystem app, embedded on demand.
 *  - Iframes load ONLY on click, never all at once.
 *  - Frame-blocking sites show a fallback note; "Open app" always works.
 *  - Wallet note: extension wallets often refuse frames; open directly.
 */

import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, MonitorPlay, X } from "lucide-react";

const APPS: { name: string; url: string; desc: string; tag: string }[] = [
  { name: "CookieScan",       url: "https://cookiescan.io",           desc: "Block explorer: slots, transactions, holders, validators.", tag: "Explorer" },
  { name: "Hyperlane Bridge", url: "https://hyperlane.cookiescan.io", desc: "Instant sCOOK / cCOOK transfers via warp route.",           tag: "Bridge" },
  { name: "CandyShop",        url: "https://swap.cookiescan.io/",     desc: "Swap aggregator on Cookie Chain.",                          tag: "DEX" },
  { name: "CookieSwap",       url: "https://cookieswap.fun/",         desc: "Native AMM DEX.",                                           tag: "DEX" },
  { name: "Cookoven",         url: "https://cookoven.xyz/",           desc: "Staking, .cook domains, and dApp hub.",                     tag: "Staking" },
  { name: "CookieBox",        url: "https://cookiebox.app/",          desc: "Ecosystem app suite.",                                      tag: "Apps" },
  { name: "BakedBazaar",      url: "https://bakedbazaar.art",         desc: "NFT marketplace on Cookie Chain.",                          tag: "NFT" },
  { name: "GorBoy",           url: "https://www.gorboy.com",          desc: "Gaming on Cookienet.",                                      tag: "Gaming" },
  { name: "Cookie Squad",     url: "https://sig.cookiechain.wtf",     desc: "Community multi-sig dashboard (Squads v4 on Cookie Chain).", tag: "Governance" },
  { name: "Cookie Docs",      url: "https://docs.cookiechain.wtf",    desc: "Developer and user documentation.",                         tag: "Docs" },
];

function AppCard({ app }: { app: (typeof APPS)[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: "var(--cook-surface)", border: "1px solid var(--cook-border)", borderRadius: "0.75rem", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1.1rem 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--cook-text-primary)" }}>{app.name}</span>
          <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-cook-amber, #F5A623)", border: "1px solid var(--color-cook-amber, #F5A623)", borderRadius: "999px", padding: "0.1rem 0.5rem" }}>{app.tag.toUpperCase()}</span>
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--cook-text-secondary)", marginTop: "0.3rem" }}>{app.desc}</div>
      </div>

      {open && (
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
  return (
    <div style={{ minHeight: "100vh", background: "var(--cook-bg)", transition: "background 0.3s ease" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 2rem 4rem" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--cook-text-secondary)", textDecoration: "none", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

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
          {APPS.map((a) => <AppCard key={a.url} app={a} />)}
        </div>
      </div>
    </div>
  );
}
