/**
 * WHITEPAPER PAGE
 * Design: Live markdown fetch from GitHub raw URL, rendered with full Cookie Chain stylesheet
 * Dark background, Space Grotesk headings, DM Sans body, violet/blue/ice accent colors
 * Sticky TOC sidebar on desktop, mobile-friendly single column
 * Route: /whitepaper
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { marked } from "marked";

const WHITEPAPER_URL =
  "https://raw.githubusercontent.com/iamabotama/cookienetsites/refs/heads/main/whitepaper.md";

const COOKIE_LOGO = "/cookie-logo.webp";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const toc: TocItem[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{1,4})\s+(.+)/);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/[*_`]/g, "").trim();
      toc.push({ id: slugify(text), text, level });
    }
  }
  return toc;
}

export default function Whitepaper() {
  const [html, setHtml] = useState<string>("");
  const [toc, setToc] = useState<TocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch(WHITEPAPER_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((md) => {
        const tocItems = extractToc(md);
        setToc(tocItems);

        // Configure marked to add IDs to headings
        const renderer = new marked.Renderer();
        renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
          const cleanText = text.replace(/<[^>]+>/g, "").replace(/[*_`]/g, "");
          const id = slugify(cleanText);
          return `<h${depth} id="${id}">${text}</h${depth}>`;
        };

        const result = marked(md, { renderer }) as string;
        setHtml(result);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Intersection observer for active TOC item
  useEffect(() => {
    if (!html || !contentRef.current) return;
    const headings = contentRef.current.querySelectorAll("h1,h2,h3,h4");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [html]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        background: "#000000",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        color: "rgba(255,255,255,0.88)",
      }}
    >
      {/* Top nav bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(0,0,0,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 2rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <img
              src={COOKIE_LOGO}
              alt="Cookie Chain"
              style={{ width: "28px", height: "28px", filter: "drop-shadow(0 0 6px rgba(37,99,235,0.5))" }}
            />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Cookie Chain
            </span>
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>/</span>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.85rem",
              color: "#60A5FA",
              fontWeight: 500,
            }}
          >
            Whitepaper
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a
            href={WHITEPAPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.45)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#60A5FA"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
          >
            Raw ↗
          </a>
          <Link
            href="/"
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.45)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
          >
            ← Back to site
          </Link>
        </div>
      </header>

      {/* Page layout */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "4rem",
          alignItems: "start",
        }}
        className="wp-layout"
      >
        {/* Sidebar TOC */}
        <aside
          style={{
            position: "sticky",
            top: "80px",
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
            paddingRight: "1rem",
            scrollbarWidth: "none",
          }}
          className="wp-sidebar"
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "1rem",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Contents
          </div>
          <nav>
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: `0.3rem 0 0.3rem ${(item.level - 1) * 0.75}rem`,
                  fontSize: item.level === 1 ? "0.82rem" : "0.78rem",
                  fontWeight: item.level <= 2 ? 600 : 400,
                  fontFamily: "'DM Sans', sans-serif",
                  color: activeId === item.id
                    ? "#60A5FA"
                    : item.level === 1
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.4)",
                  borderLeft: activeId === item.id
                    ? "2px solid #2563EB"
                    : "2px solid transparent",
                  paddingLeft: `calc(${(item.level - 1) * 0.75}rem + 0.75rem)`,
                  transition: "color 0.15s, border-color 0.15s",
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => {
                  if (activeId !== item.id) {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeId !== item.id) {
                    (e.currentTarget as HTMLElement).style.color =
                      item.level === 1 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)";
                  }
                }}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main>
          {loading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "50vh",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid rgba(37,99,235,0.2)",
                  borderTop: "2px solid #2563EB",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9rem" }}>
                Fetching whitepaper from repository…
              </p>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "2rem",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "0.75rem",
                color: "#FCA5A5",
              }}
            >
              <strong>Failed to load whitepaper:</strong> {error}
              <br />
              <a
                href={WHITEPAPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#60A5FA", marginTop: "0.5rem", display: "inline-block" }}
              >
                View raw on GitHub ↗
              </a>
            </div>
          )}

          {!loading && !error && (
            <div
              ref={contentRef}
              className="wp-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive layout */
        @media (max-width: 900px) {
          .wp-layout {
            grid-template-columns: 1fr !important;
          }
          .wp-sidebar {
            display: none !important;
          }
        }

        /* Whitepaper markdown typography */
        .wp-content {
          line-height: 1.75;
          font-size: 1rem;
          color: rgba(255,255,255,0.82);
        }

        .wp-content h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          letter-spacing: -0.03em;
          color: #ffffff;
          margin: 0 0 1.5rem 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(37,99,235,0.2);
          line-height: 1.2;
        }

        .wp-content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          letter-spacing: -0.02em;
          color: #ffffff;
          margin: 3rem 0 1rem 0;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          line-height: 1.3;
        }

        .wp-content h1 + h2 {
          border-top: none;
          margin-top: 1.5rem;
        }

        .wp-content h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: -0.01em;
          color: #BAE6FD;
          margin: 2rem 0 0.75rem 0;
          line-height: 1.4;
        }

        .wp-content h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.65);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 1.5rem 0 0.5rem 0;
        }

        .wp-content p {
          margin: 0 0 1.25rem 0;
          color: rgba(255,255,255,0.78);
          font-size: 0.975rem;
          line-height: 1.8;
        }

        .wp-content a {
          color: #60A5FA;
          text-decoration: none;
          border-bottom: 1px solid rgba(96,165,250,0.3);
          transition: color 0.15s, border-color 0.15s;
        }

        .wp-content a:hover {
          color: #BAE6FD;
          border-bottom-color: rgba(186,230,253,0.5);
        }

        .wp-content strong {
          color: #ffffff;
          font-weight: 700;
        }

        .wp-content em {
          color: rgba(255,255,255,0.65);
          font-style: italic;
        }

        .wp-content ul, .wp-content ol {
          margin: 0 0 1.25rem 0;
          padding-left: 1.5rem;
          color: rgba(255,255,255,0.75);
          font-size: 0.975rem;
          line-height: 1.8;
        }

        .wp-content li {
          margin-bottom: 0.4rem;
        }

        .wp-content li::marker {
          color: #2563EB;
        }

        .wp-content ol li::marker {
          color: #7B2FBE;
          font-weight: 700;
        }

        .wp-content blockquote {
          margin: 1.5rem 0;
          padding: 1rem 1.5rem;
          border-left: 3px solid #2563EB;
          background: rgba(37,99,235,0.06);
          border-radius: 0 0.5rem 0.5rem 0;
          color: rgba(255,255,255,0.7);
          font-style: italic;
        }

        .wp-content code {
          font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
          font-size: 0.875em;
          background: rgba(37,99,235,0.12);
          color: #BAE6FD;
          padding: 0.15em 0.45em;
          border-radius: 0.25rem;
          border: 1px solid rgba(37,99,235,0.2);
        }

        .wp-content pre {
          background: rgba(10,10,20,0.8);
          border: 1px solid rgba(37,99,235,0.18);
          border-radius: 0.75rem;
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .wp-content pre code {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.8);
        }

        .wp-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9rem;
          overflow: hidden;
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .wp-content thead {
          background: rgba(37,99,235,0.12);
        }

        .wp-content th {
          padding: 0.75rem 1rem;
          text-align: left;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #60A5FA;
          border-bottom: 1px solid rgba(37,99,235,0.2);
        }

        .wp-content td {
          padding: 0.7rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.75);
          vertical-align: top;
        }

        .wp-content tr:last-child td {
          border-bottom: none;
        }

        .wp-content tr:hover td {
          background: rgba(37,99,235,0.04);
        }

        .wp-content hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 2.5rem 0;
        }

        /* Scrollbar for sidebar */
        .wp-sidebar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
