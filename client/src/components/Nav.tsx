/*
 * COOKIE CHAIN NAV
 * Design: Transparent on load, opaque blur on scroll — mirrors Solana.com nav behavior
 * Logo: Amber C-chain mark + "COOKIE CHAIN" wordmark in Space Grotesk
 */

import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663273809872/J3hDDZc9FEamYFSB95Wtww/cookiechain-logo-BGKnVNhsxP8SqdU5Bb2HpX.webp";

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Bridge", href: "#bridge" },
  { label: "Governance", href: "#governance" },
  { label: "Ecosystem", href: "#ecosystem" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(0,0,0,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <CookieLogo />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.04em",
                color: "#ffffff",
              }}
            >
              COOKIE CHAIN
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                  transition: "color 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={LINKS.buy_cook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-amber"
              style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem" }}
            >
              Buy $COOK
            </a>
            <a
              href={LINKS.cookiescan}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem" }}
            >
              Explorer ↗
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-white transition-all duration-200"
              style={{ transform: mobileOpen ? "rotate(45deg) translate(2px, 2px)" : "none" }} />
            <span className="block w-5 h-0.5 bg-white transition-all duration-200"
              style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span className="block w-5 h-0.5 bg-white transition-all duration-200"
              style={{ transform: mobileOpen ? "rotate(-45deg) translate(2px, -2px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: "rgba(0,0,0,0.96)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
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
                  color: "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 mt-2">
              <a href={LINKS.buy_cook} target="_blank" rel="noopener noreferrer"
                className="btn-amber" style={{ fontSize: "0.875rem" }}>
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

// Inline SVG cookie-chain logo mark
function CookieLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cookie circle */}
      <circle cx="16" cy="16" r="14" fill="#1a1a1a" stroke="#F5A623" strokeWidth="1.5"/>
      {/* Chain links */}
      <path d="M10 16c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4c-2.2 0-4-1.8-4-4z"
        stroke="#F5A623" strokeWidth="1.5" fill="none"/>
      <path d="M13 16h6" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Cookie dots */}
      <circle cx="11" cy="11" r="1.2" fill="#F5A623" opacity="0.6"/>
      <circle cx="21" cy="11" r="1.2" fill="#14F195" opacity="0.6"/>
      <circle cx="11" cy="21" r="1.2" fill="#14F195" opacity="0.6"/>
      <circle cx="21" cy="21" r="1.2" fill="#F5A623" opacity="0.6"/>
    </svg>
  );
}
