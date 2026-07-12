/*
 * PERFORMANCE SECTION — theme-aware
 * All colors via CSS variables (--cook-*) for automatic light/dark switching
 */

import { useEffect, useRef, useState } from "react";
import StreamCanvas from "../StreamCanvas";
import { useTheme } from "@/contexts/ThemeContext";
import { DataBadge, ProvenanceKind } from "@/components/Provenance";

const METRICS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    value: "~110%",
    label: "Exit backing ratio",
    sub: "Every genesis holder's exit is covered",
    prov: "snapshot" as ProvenanceKind, at: "Jul 3, 2026", source: "whitepaper §3.4",
    href: "https://invest.cookiechain.wtf/whitepaper",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#60A5FA" strokeWidth="1.5"/>
        <path d="M10 6v4l3 2" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    value: "6-of-10",
    label: "Multi-sig threshold",
    sub: "Community governance on both chains",
    prov: "snapshot" as ProvenanceKind, at: "Jul 3, 2026", source: "Squads / Cookiequads (live config)",
    href: "https://app.squads.so/squads/DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx/home",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="#7B2FBE" strokeWidth="1.5"/>
        <path d="M7 10h6M10 7v6" stroke="#7B2FBE" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    value: "12,528",
    label: "COOK holder wallets",
    sub: "Every legacy holder made whole at launch",
    prov: "snapshot" as ProvenanceKind, at: "Jul 3, 2026", source: "cookiescan.io",
    href: "https://cookiescan.io",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10h14M10 3l7 7-7 7" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    value: "1:1",
    label: "Bridge ratio",
    sub: "No minting, no burning — pure custody transfer",
    prov: "fixed" as ProvenanceKind,
    href: "https://invest.cookiechain.wtf/whitepaper",
  },
];

export default function Performance() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { isLight } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cardBg = isLight ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.72)";
  const cardBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)";

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "var(--cook-bg-2)",
        overflow: "hidden",
        padding: "6rem 0",
        transition: "background 0.3s ease",
      }}
    >
      {/* Live particle stream animation */}
      <StreamCanvas
        style={{ zIndex: 1 }}
        maxStreams={14}
        spawnRate={0.018}
      />

      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="flex-col-mobile"
        >
          {/* Left: headline */}
          <div>
            <div className="section-label" style={{ marginBottom: "1rem" }}>Infrastructure</div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                color: "var(--cook-text-primary)",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              Built to last.<br />
              <span style={{
                background: "linear-gradient(135deg, #7B2FBE 0%, #2563EB 55%, #38BDF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Backed to exit.
              </span>
            </h2>
            <p style={{
              color: "var(--cook-text-secondary)",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "440px",
              marginBottom: "2rem",
            }}>
              Cookie Chain launched with a working product, not a promise. Consistent slot progression, steady validator participation, and a growing dApp ecosystem — every data point points in one direction. The infrastructure was designed for the long term, and the numbers reflect it.
            </p>
            <a
              href="https://app.squads.so/squads/DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx/treasury"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ fontSize: "0.875rem" }}
            >
              View Multi-Sig Treasury ↗
            </a>
          </div>

          {/* Right: metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                style={{
                  background: cardBg,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease ${0.1 + i * 0.08}s, transform 0.6s ease ${0.1 + i * 0.08}s`,
                }}
              >
                <div style={{ marginBottom: "0.75rem" }}>{m.icon}</div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "var(--cook-text-primary)",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.25rem",
                }}>
                  {m.value}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--cook-text-secondary)", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {m.label}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--cook-text-muted)", lineHeight: 1.4 }}>
                  {m.sub}
                </div>
                <div style={{ marginTop: "0.6rem" }}>
                  <DataBadge kind={m.prov} source={m.source} at={m.at} href={m.href} />
                </div>
              </div>
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
