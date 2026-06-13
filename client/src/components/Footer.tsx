/*
 * FOOTER
 * Design: Pure black, small-caps category labels, clean link columns
 * Mirrors Solana Foundation footer exactly
 * All links sourced from cookiechain.json
 */

import { LINKS } from "@/lib/links";

const FOOTER_COLS = [
  {
    label: "Token",
    links: [
      { text: "Tokenomics", href: "#tokenomics" },
      { text: "Whitepaper", href: LINKS.whitepaper },
      { text: "Buy $COOK (Jupiter)", href: LINKS.buy_cook },
      { text: "View on Solscan", href: LINKS.solscan_token },
      { text: "Docs", href: LINKS.docs },
    ],
  },
  {
    label: "Network",
    links: [
      { text: "CookieScan Explorer", href: LINKS.cookiescan },
      { text: "Cookienet Bridge", href: LINKS.bridge },
      { text: "Cookie Squad Multi-Sig", href: LINKS.multisig },
      { text: "Governance", href: "#governance" },
    ],
  },
  {
    label: "Ecosystem",
    links: [
      { text: "Cookoven (Staking)", href: LINKS.cookoven },
      { text: "CookieSwap (DEX)", href: LINKS.cookieswap },
      { text: "CandyShop (Swap)", href: LINKS.candyshop },
      { text: "CookieBox", href: LINKS.cookiebox },
      { text: "BakedBazaar (NFT)", href: LINKS.bakedbazaar },
      { text: "gorboy", href: LINKS.gorboy },
    ],
  },
  {
    label: "Community",
    links: [
      { text: "X / Twitter", href: LINKS.twitter },
      { text: "Telegram", href: LINKS.telegram },
      { text: "Community Site", href: LINKS.community_site },
      { text: "GitHub", href: LINKS.github },
      { text: "Docs", href: LINKS.docs },
    ],
  },
];

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer style={{ background: "#000000", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "3rem" }}>
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", filter: "drop-shadow(0 0 6px rgba(37,99,235,0.4))" }}>
            <img src="/manus-storage/cookie-logo-original_830062d7.webp" alt="Cookie Chain" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.06em",
            color: "#ffffff",
          }}>
            COOKIE CHAIN
          </span>
        </div>

        {/* Link columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem",
        }}>
          {FOOTER_COLS.map((col) => (
            <div key={col.label}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "1rem",
              }}>
                {col.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {col.links.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.55)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
            © 2026 Cookie Chain Community. Not financial advice. DYOR.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { text: "Whitepaper", href: LINKS.whitepaper },
              { text: "Docs", href: LINKS.docs },
            ].map((link) => (
              <a
                key={link.text}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.25)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


