/*
 * VALIDATOR WORLD MAP
 * Plots validator locations on a world map (d3-geo natural earth projection,
 * land shapes from world-atlas topojson bundled at build time).
 *
 * DATA: client/src/data/validators.ts — populate lat/lon per validator.
 * The section renders ONLY when at least one validator has coordinates, so
 * shipping with an empty list is safe.
 *
 * How to populate (browser-agent task):
 *   1. POST to https://rpc.cookiescan.io {"jsonrpc":"2.0","id":1,"method":"getClusterNodes"}
 *      → gossip IP per validator identity.
 *   2. Geolocate each IP (e.g. ipinfo.io/<ip>/json or ip-api.com/json/<ip>)
 *      → { lat, lon, city, country }.
 *   3. Fill VALIDATORS below. Locations are approximate (datacenter city).
 */

import { useEffect, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import land110 from "world-atlas/land-110m.json";
import { DataBadge } from "@/components/Provenance";
import { VALIDATORS, VALIDATORS_AS_OF } from "@/data/validators";

const WIDTH = 960;
const HEIGHT = 470;

export default function ValidatorMap() {
  const located = VALIDATORS.filter((v) => v.lat !== null && v.lon !== null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (located.length === 0) return null; // safe to ship before data exists

  const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], { type: "Sphere" } as any);
  const path = geoPath(projection);
  const land = feature(land110 as any, (land110 as any).objects.land) as any;

  return (
    <section
      ref={ref}
      style={{ background: "var(--cook-bg)", padding: "6rem 0", transition: "background 0.3s ease" }}
    >
      <div className="container" style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>
        <div className="section-label" style={{ marginBottom: "1rem" }}>Validator Network</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
            letterSpacing: "-0.03em",
            color: "var(--cook-text-primary)",
            margin: 0,
          }}>
            {located.length} validator{located.length === 1 ? "" : "s"} around the world
          </h2>
          <DataBadge kind="snapshot" at={VALIDATORS_AS_OF} source="getClusterNodes + IP geolocation" href="https://cookiescan.io" />
        </div>
        <p style={{ color: "var(--cook-text-secondary)", fontSize: "0.95rem", maxWidth: "560px", lineHeight: 1.6, marginBottom: "2rem" }}>
          Locations are approximate (datacenter city, from validator gossip addresses).
        </p>

        <div style={{
          border: "1px solid var(--cook-border)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          background: "var(--cook-surface)",
        }}>
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="World map of validator locations">
            <path d={path({ type: "Sphere" } as any) ?? undefined} fill="transparent" stroke="var(--cook-border)" strokeWidth={1} />
            <path d={path(land) ?? undefined} fill="var(--cook-surface-2)" stroke="var(--cook-border)" strokeWidth={0.6} />
            {(() => {
              /* group by rounded coordinate; fan out siblings horizontally
                 in screen space so co-located datacenters stay readable */
              const groups = new Map<string, number>();
              const indexOf = new Map<string, number>();
              for (const v of located) {
                const k = `${(v.lat as number).toFixed(1)},${(v.lon as number).toFixed(1)}`;
                indexOf.set(v.identity, groups.get(k) ?? 0);
                groups.set(k, (groups.get(k) ?? 0) + 1);
              }
              return located.map((v) => {
                const p = projection([v.lon as number, v.lat as number]);
                if (!p) return null;
                const k = `${(v.lat as number).toFixed(1)},${(v.lon as number).toFixed(1)}`;
                const n = groups.get(k) ?? 1;
                const i = indexOf.get(v.identity) ?? 0;
                const x = p[0] + (n > 1 ? i * 16 - ((n - 1) * 16) / 2 : 0);
                const y = p[1];
                return (
                <g key={v.identity} transform={`translate(${x},${y})`}>
                  <circle r={10} fill="#22C55E22">
                    <animate attributeName="r" values="7;13;7" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle r={4} fill="#22C55E" stroke="var(--cook-bg)" strokeWidth={1.5} />
                  <title>{`${v.name ?? v.identity.slice(0, 8) + "…"} — ${[v.city, v.country].filter(Boolean).join(", ")}`}</title>
                </g>
                );
              });
            })()}
          </svg>
        </div>
      </div>
    </section>
  );
}
