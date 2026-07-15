/*
 * COOKIE CHAIN — APP EXPLORER — theme-aware
 *
 * Live, clickable proof of the dApp ecosystem. A grid of every app in the
 * community registry (cookiechain/apps → apps.json, fetched at runtime so
 * this page never drifts from the registry). Clicking "Preview" loads that
 * ONE app in an embedded viewer — apps are never all loaded at once.
 *
 * Embedding realities handled here:
 *  - Sites sending X-Frame-Options / CSP frame-ancestors render blank in an
 *    iframe, and cross-origin JS cannot detect it. So: a persistent
 *    "Open in new tab" affordance, a visible hint in the viewer, and a
 *    NO_EMBED list for third-party sites known to block framing.
 *  - Extension wallets often refuse to inject into cross-origin frames, so
 *    the viewer shows a "wallet connections work best in a full tab" note
 *    for DeFi/Wallet apps.
 */

import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, ExternalLink, X, Play, Loader2, Wallet, Wrench,
} from "lucide-react";

const COOKIE_LOGO = "/cookie-logo.webp";
const REGISTRY_URL =
  "https://raw.githubusercontent.com/cookiechain/apps/main/apps.json";
const REGISTRY_REPO = "https://github.com/cookiechain/apps";

/* Third-party sites known/likely to send X-Frame-Options or
 * CSP frame-ancestors — card shows "Open ↗" only, no Preview. */
const NO_EMBED = new Set(["Nightly Wallet", "DefiLlama", "Metaplex"]);

interface AppEntry {
  title: string;
  description: string;
  tag: string;
  href: string;
  x?: string;
  logo?: string;
  live?: boolean;
}

const card: React.CSSProperties = {
  background: "var(--cook-card-bg)",
  border: "1px solid var(--cook-card-border)",
  borderRadius: "16px",
  padding: "1.25rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  fontSize: "0.8rem",
  fontWeight: 600,
  padding: "0.45rem 0.9rem",
  borderRadius: "10px",
  cursor: "pointer",
  textDecoration: "none",
  border: "1px solid var(--cook-card-border)",
  background: "transparent",
  color: "var(--cook-text-secondary)",
  transition: "color 0.2s, border-color 0.2s, background 0.2s",
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  border: "1px solid rgba(56,189,248,0.4)",
  color: "#38BDF8",
};

const TAG_COLORS: Record<string, string> = {
  Infra: "#38BDF8",
  DeFi: "#4ADE80",
  Wallet: "#FBBF24",
  NFT: "#F472B6",
  Meme: "#A78BFA",
};

export default function Apps() {
  const [apps, setApps] = useState<AppEntry[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [tagFilter, setTagFilter] = useState<string>("All");
  const [viewing, setViewing] = useState<AppEntry | null>(null);
  const [frameLoading, setFrameLoading] = useState(false);

  useEffect(() => {
    fetch(REGISTRY_URL)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data: AppEntry[]) => setApps(data))
      .catch(() => setLoadError(true));
  }, []);

  const closeViewer = useCallback(() => setViewing(null), []);

  /* Escape closes the viewer; lock body scroll while open */
  useEffect(() => {
    if (!viewing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeViewer();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [viewing, closeViewer]);

  const openViewer = (app: AppEntry) => {
    setFrameLoading(true);
    setViewing(app);
  };

  const tags = ["All", ...Array.from(new Set((apps ?? []).map((a) => a.tag)))];
  const shown = (apps ?? []).filter(
    (a) => tagFilter === "All" || a.tag === tagFilter,
  );
  const walletSensitive = viewing && ["DeFi", "Wallet", "NFT"].includes(viewing.tag);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cook-bg)", fontFamily: "'DM Sans', sans-serif", transition: "background 0.3s ease" }}>

      {/* Sticky nav bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--cook-nav-scrolled)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--cook-nav-border)",
        padding: "0 2rem", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--cook-text-secondary)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#38BDF8")}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "var(--cook-text-secondary)")}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src={COOKIE_LOGO} alt="Cookie Chain" style={{ width: "24px", height: "24px", borderRadius: "50%", filter: "drop-shadow(0 0 6px rgba(37,99,235,0.5))" }} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "var(--cook-text-primary)", letterSpacing: "0.04em" }}>
            APP EXPLORER
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2rem", fontWeight: 700, color: "var(--cook-text-primary)", marginBottom: "0.75rem" }}>
          The Cookie Chain Ecosystem, Live
        </h1>
        <p style={{ color: "var(--cook-text-secondary)", maxWidth: "760px", lineHeight: 1.7, marginBottom: "0.75rem" }}>
          Every app below is real, deployed, and community-built. Hit{" "}
          <strong style={{ color: "var(--cook-text-primary)" }}>Preview</strong>{" "}
          to run one right here on the page, or open it in its own tab. This list
          is loaded straight from the public{" "}
          <a href={REGISTRY_REPO} target="_blank" rel="noopener noreferrer" style={{ color: "#38BDF8" }}>
            apps registry
          </a>{" "}
          — what you see is what ships.
        </p>
        <p style={{ color: "var(--cook-text-secondary)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          Previews run the actual live app. For anything involving a wallet
          connection, opening the app in a full tab is recommended.
        </p>

        {/* Tag filter */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {tags.map((t) => (
            <button key={t} onClick={() => setTagFilter(t)}
              style={{
                ...btn,
                ...(tagFilter === t
                  ? { color: "#38BDF8", borderColor: "rgba(56,189,248,0.4)", background: "rgba(56,189,248,0.08)" }
                  : {}),
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loadError && (
          <div style={{ ...card, alignItems: "flex-start" }}>
            <span style={{ color: "var(--cook-text-primary)", fontWeight: 600 }}>
              Couldn't load the app registry.
            </span>
            <a href={REGISTRY_REPO} target="_blank" rel="noopener noreferrer" style={{ ...btnPrimary }}>
              View the registry on GitHub <ExternalLink size={14} />
            </a>
          </div>
        )}
        {!apps && !loadError && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--cook-text-secondary)" }}>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading apps…
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {shown.map((app) => {
            const embeddable = app.live !== false && !NO_EMBED.has(app.title);
            const tagColor = TAG_COLORS[app.tag] ?? "#38BDF8";
            return (
              <div key={app.title} style={card}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {app.logo && (
                    <img src={app.logo} alt="" loading="lazy"
                      style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover" }} />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--cook-text-primary)", fontSize: "1rem" }}>
                      {app.title}
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginTop: "2px" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", color: tagColor }}>
                        {app.tag.toUpperCase()}
                      </span>
                      {app.live === false && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "var(--cook-text-secondary)" }}>
                          <Wrench size={11} /> in development
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p style={{ color: "var(--cook-text-secondary)", fontSize: "0.85rem", lineHeight: 1.55, margin: 0, flexGrow: 1 }}>
                  {app.description}
                </p>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {embeddable && (
                    <button style={btnPrimary} onClick={() => openViewer(app)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(56,189,248,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Play size={14} /> Preview
                    </button>
                  )}
                  <a href={app.href} target="_blank" rel="noopener noreferrer" style={btn}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#38BDF8"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--cook-text-secondary)"; }}
                  >
                    Open <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Viewer modal — exactly ONE iframe, mounted on demand ===== */}
      {viewing && (
        <div
          onClick={(e) => e.target === e.currentTarget && closeViewer()}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div style={{
            width: "min(1200px, 100%)", height: "min(820px, 100%)",
            background: "var(--cook-bg)",
            border: "1px solid var(--cook-card-border)",
            borderRadius: "16px", overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}>
            {/* Viewer header */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.6rem 1rem",
              borderBottom: "1px solid var(--cook-card-border)",
              background: "var(--cook-card-bg)",
            }}>
              {viewing.logo && (
                <img src={viewing.logo} alt="" style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
              )}
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--cook-text-primary)", fontSize: "0.9rem" }}>
                {viewing.title}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--cook-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexGrow: 1 }}>
                {viewing.href}
              </span>
              <a href={viewing.href} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
                Open in new tab <ExternalLink size={13} />
              </a>
              <button onClick={closeViewer} aria-label="Close preview"
                style={{ ...btn, padding: "0.45rem 0.6rem" }}>
                <X size={16} />
              </button>
            </div>

            {/* Frame area */}
            <div style={{ position: "relative", flexGrow: 1, background: "var(--cook-bg)" }}>
              {frameLoading && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex",
                  flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "0.75rem", color: "var(--cook-text-secondary)", pointerEvents: "none",
                }}>
                  <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: "0.85rem" }}>Loading {viewing.title}…</span>
                </div>
              )}
              <iframe
                key={viewing.href}
                src={viewing.href}
                title={viewing.title}
                onLoad={() => setFrameLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              />
            </div>

            {/* Footer hint */}
            <div style={{
              padding: "0.5rem 1rem",
              borderTop: "1px solid var(--cook-card-border)",
              background: "var(--cook-card-bg)",
              display: "flex", alignItems: "center", gap: "0.5rem",
              color: "var(--cook-text-secondary)", fontSize: "0.75rem", lineHeight: 1.4,
            }}>
              {walletSensitive && <Wallet size={13} style={{ flexShrink: 0 }} />}
              <span>
                Live app, running inside this page.
                {walletSensitive && " Wallet connections work best in a full tab."}
                {" "}Blank screen? The app may block embedding — use “Open in new tab”.
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
