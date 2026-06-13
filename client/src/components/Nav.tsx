/*
 * COOKIE CHAIN NAV — v2
 * Design: Transparent on load, opaque blur on scroll
 * Logo: actual cookie sticker with subtle blue glow + "COOKIE CHAIN" wordmark
 * Colors: electric blue primary, ice blue hover
 */

import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";

const COOKIE_LOGO = "/manus-storage/cookie-logo-original_830062d7.webp";

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Bridge", href: "#bridge" },
  { label: "Governance", href: "#governance" },
  { label: "Ecosystem", href: "#ecosystem" },
];

const NAV_WHITEPAPER = "/whitepaper";

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
        background: scrolled ? "rgba(0,0,0,0.90)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group" style={{ textDecoration: "none" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              filter: "drop-shadow(0 0 8px rgba(37,99,235,0.4))",
              transition: "filter 0.2s ease",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 14px rgba(37,99,235,0.7))")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 8px rgba(37,99,235,0.4))")}
            >
              <img
                src={COOKIE_LOGO}
                alt="Cookie Chain"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                color: "#ffffff",
                whiteSpace: "nowrap",
              }}
            >
              COOKIE CHAIN
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.65)",
                  transition: "color 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#BAE6FD")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={NAV_WHITEPAPER}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#60A5FA")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              Whitepaper
            </a>
            <a
              href={LINKS.buy_cook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
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
          background: "rgba(0,0,0,0.97)",
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
