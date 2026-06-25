/*
 * COOKIE CHAIN NAV — v4 (xl breakpoint to prevent overlap)
 * Hamburger kicks in at <1280px so the full nav never squishes
 */

import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

const COOKIE_LOGO = "/cookie-logo.webp";

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Bridge", href: "#bridge" },
  { label: "Governance", href: "#governance" },
  { label: "Ecosystem", href: "#ecosystem" },
];

const NAV_WHITEPAPER = "/whitepaper";
const NAV_MARKETS = "/markets";
const NAV_CHAIN = "/chain";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLight } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "var(--cook-nav-text)",
    transition: "color 0.2s",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "var(--cook-nav-scrolled)" : "var(--cook-nav-bg)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--cook-nav-border)" : "none",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="https://cookiechain.wtf" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 shrink-0"
            style={{ textDecoration: "none" }}>
            <div style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              filter: "drop-shadow(0 0 8px rgba(37,99,235,0.4))",
              transition: "filter 0.2s ease",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 14px rgba(37,99,235,0.7))")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 8px rgba(37,99,235,0.4))")}
            >
              <img src={COOKIE_LOGO} alt="Cookie Chain" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              color: "var(--cook-text-primary)",
              whiteSpace: "nowrap",
            }}>
              COOKIE CHAIN
            </span>
          </a>

          {/* Desktop nav — hidden below xl (1280px) */}
          <nav className="hidden xl:flex items-center gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#38BDF8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cook-nav-text)")}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA group — hidden below xl */}
          <div className="hidden xl:flex items-center gap-2">
            <ThemeToggle />
            <div style={{ width: "1px", height: "16px", background: "var(--cook-border)", margin: "0 0.1rem" }} />
            <a href="https://cookiechain.wtf" target="_blank" rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#38BDF8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cook-nav-text)")}
            >Community ↗</a>
            <a href={NAV_CHAIN} style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#A78BFA")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cook-nav-text)")}
            >The Chain</a>
            <a href={NAV_MARKETS} style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4ADE80")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cook-nav-text)")}
            >Markets</a>
            <a href={NAV_WHITEPAPER} style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#60A5FA")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cook-nav-text)")}
            >Whitepaper</a>
            <a href={LINKS.buy_cook} target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: "0.8rem", padding: "0.45rem 1rem" }}
            >Buy $COOK</a>
            <a href={LINKS.cookiescan} target="_blank" rel="noopener noreferrer"
              className="btn-outline"
              style={{ fontSize: "0.8rem", padding: "0.45rem 1rem" }}
            >Explorer ↗</a>
          </div>

          {/* Hamburger — shown below xl */}
          <div className="xl:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <span className="block w-5 h-0.5 transition-all duration-200"
                style={{ background: "var(--cook-text-primary)", transform: mobileOpen ? "rotate(45deg) translate(2px, 2px)" : "none" }} />
              <span className="block w-5 h-0.5 transition-all duration-200"
                style={{ background: "var(--cook-text-primary)", opacity: mobileOpen ? 0 : 1 }} />
              <span className="block w-5 h-0.5 transition-all duration-200"
                style={{ background: "var(--cook-text-primary)", transform: mobileOpen ? "rotate(-45deg) translate(2px, -2px)" : "none" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet menu */}
      {mobileOpen && (
        <div style={{
          background: isLight ? "rgba(255,255,255,0.97)" : "rgba(0,0,0,0.97)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--cook-nav-border)",
        }}>
          <div className="container py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--cook-text-primary)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ height: "1px", background: "var(--cook-border)", margin: "0.25rem 0" }} />
            <a href="https://cookiechain.wtf" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.125rem", fontWeight: 600, color: "#38BDF8", textDecoration: "none" }}
              onClick={() => setMobileOpen(false)}
            >Community ↗</a>
            <a href={NAV_CHAIN}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.125rem", fontWeight: 600, color: "#A78BFA", textDecoration: "none" }}
              onClick={() => setMobileOpen(false)}
            >The Chain</a>
            <a href={NAV_MARKETS}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.125rem", fontWeight: 600, color: "#60A5FA", textDecoration: "none" }}
              onClick={() => setMobileOpen(false)}
            >Markets</a>
            <a href={NAV_WHITEPAPER}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.125rem", fontWeight: 600, color: "#38BDF8", textDecoration: "none" }}
              onClick={() => setMobileOpen(false)}
            >Whitepaper</a>
            <div className="flex gap-3 mt-2">
              <a href={LINKS.buy_cook} target="_blank" rel="noopener noreferrer"
                className="btn-primary" style={{ fontSize: "0.875rem" }}>
                Buy $COOK
              </a>
              <a href={LINKS.cookiescan} target="_blank" rel="noopener noreferrer"
                className="btn-outline" style={{ fontSize: "0.875rem" }}>
                Explorer ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
