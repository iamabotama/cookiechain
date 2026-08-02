/*
 * CMC LISTING VERIFICATION — /verification
 *
 * On-domain proof of authenticity for the CoinMarketCap listing request.
 * Statement text mirrors the official announcement; page carries a fixed
 * publish timestamp (reviewers look for one).
 *
 * Aggregator links are intentionally dofollow (no rel="nofollow") per SEO
 * intent — only noopener for tab-safety. Icon <img> tags point at
 * /assets/cmc-icon.svg and /assets/coingecko-icon.svg; if those files are
 * ever added to client/public/assets/ (official brand kits), they render
 * automatically — until then the onError handler hides the img and the
 * styled badge stands alone.
 */

import { Link } from "wouter";
import { ArrowLeft, BadgeCheck, ExternalLink, FileText } from "lucide-react";

const COOKIE_LOGO = "/cookie-logo.webp";
const CA = "36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1";
const PUBLISHED = "August 1, 2026 · 06:00 UTC";
const CMC_TICKET = "#1442016";
const SUBMITTED = "Submitted August 1, 2026";

const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.8rem 1.3rem",
  borderRadius: "12px",
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  fontSize: "0.95rem",
  color: "#fff",
  textDecoration: "none",
  transition: "transform 0.15s, box-shadow 0.15s",
};

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

export default function Verification() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cook-bg)", fontFamily: "'DM Sans', sans-serif", transition: "background 0.3s ease" }}>
      {/* Sticky nav */}
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
            LISTING VERIFICATION
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3.5rem 2rem 5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <BadgeCheck size={30} color="#4ADE80" />
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.9rem", fontWeight: 700, color: "var(--cook-text-primary)", margin: 0 }}>
            CoinMarketCap Listing Verification
          </h1>
        </div>

        <div style={{ fontSize: "0.8rem", color: "var(--cook-text-secondary)", marginBottom: "1.75rem" }}>
          Published {PUBLISHED}
        </div>

        {/* CMC ticket number — big and unmissable for verification */}
        <div style={{
          background: "linear-gradient(135deg, rgba(56,97,251,0.12), rgba(56,189,248,0.08))",
          border: "1px solid rgba(56,97,251,0.45)",
          borderRadius: "16px",
          padding: "1.5rem 1.75rem",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.08em", color: "var(--cook-text-secondary)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
            CoinMarketCap Application Ticket
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            fontWeight: 700,
            color: "#38BDF8",
            letterSpacing: "0.03em",
            lineHeight: 1.1,
          }}>
            {CMC_TICKET}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--cook-text-secondary)", marginTop: "0.5rem" }}>
            {SUBMITTED} · via CoinMarketCap's official request form
          </div>
        </div>

        <div style={{
          background: "var(--cook-card-bg)",
          border: "1px solid var(--cook-card-border)",
          borderRadius: "16px",
          padding: "1.5rem 1.75rem",
          marginBottom: "1.5rem",
          lineHeight: 1.7,
          color: "var(--cook-text-primary)",
          fontSize: "1.02rem",
        }}>
          We have submitted Cookie Chain ($COOK) to @CoinMarketCap for listing.
          This post verifies the request originates from the official Cookie
          Chain team.
        </div>

        <div style={{
          background: "var(--cook-card-bg)",
          border: "1px solid var(--cook-card-border)",
          borderRadius: "16px",
          padding: "1.25rem 1.75rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "var(--cook-text-secondary)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
            Contract Address (Solana · SPL Token-2022)
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.95rem", color: "var(--cook-text-primary)", wordBreak: "break-all" }}>
            {CA}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <FileText size={16} color="#38BDF8" />
          <a href="https://invest.cookiechain.wtf/whitepaper" style={{ color: "#38BDF8", fontSize: "0.95rem" }}>
            Whitepaper: https://invest.cookiechain.wtf/whitepaper
          </a>
        </div>

        <div style={{ fontSize: "0.85rem", color: "var(--cook-text-secondary)", marginBottom: "0.9rem" }}>
          Verify $COOK on independent aggregators:
        </div>

        <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
          <a
            href={`https://dex.coinmarketcap.com/token/solana/${CA}/`}
            target="_blank" rel="noopener"
            style={{ ...badge, background: "#3861FB", boxShadow: "0 4px 18px rgba(56,97,251,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >
            <img src="/assets/cmc-icon.svg" alt="" width={22} height={22} onError={hideOnError} />
            CoinMarketCap DEXScan
            <ExternalLink size={15} />
          </a>
          <a
            href="https://www.coingecko.com/en/coins/cookie-2"
            target="_blank" rel="noopener"
            style={{ ...badge, background: "#8BC53F", boxShadow: "0 4px 18px rgba(139,197,63,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >
            <img src="/assets/coingecko-icon.svg" alt="" width={22} height={22} onError={hideOnError} />
            CoinGecko
            <ExternalLink size={15} />
          </a>
        </div>

        <div style={{ marginTop: "2.5rem", fontSize: "0.8rem", color: "var(--cook-text-secondary)", lineHeight: 1.6 }}>
          The online submission form is the only channel Cookie Chain uses to
          request listings. Cookie Chain never solicits or pays intermediaries
          for listings; any such request claiming to act on our behalf is
          fraudulent.
        </div>
      </div>
    </div>
  );
}
