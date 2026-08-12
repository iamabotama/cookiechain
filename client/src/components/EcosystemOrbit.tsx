/*
 * ECOSYSTEM ORBIT — animated orbital map of the Cookie Chain network.
 * Self-contained cosmic scene (fixed dark palette, independent of site theme).
 * Logos load from the community apps registry (cookiechain/apps).
 */

const LOGO = (f: string) =>
  `https://raw.githubusercontent.com/cookiechain/apps/main/logos/${f}`;

const COLORS = {
  infra: "#2FBFA8",
  defi: "#8B7BF7",
  wallet: "#F0997B",
  nft: "#ED93B1",
  ai: "#4CC9F0",
  meme: "#FF6FA5",
  validator: "#F2A93B",
};

interface OrbitNode {
  name: string;
  x: number;
  y: number;
  color: string;
  logo?: string;
}

/* Middle ring (r=185): core infrastructure */
const INFRA: OrbitNode[] = [
  { name: "CookieScan", x: 446, y: 278, color: COLORS.infra, logo: "cookiescan.png" },
  { name: "DAS API", x: 520, y: 386, color: COLORS.infra, logo: "das.png" },
  { name: "RPC nodes", x: 503, y: 517, color: COLORS.infra },
  { name: "Cookie Lock", x: 405, y: 603, color: COLORS.infra, logo: "cooklock.png" },
  { name: "Cookie MCP", x: 275, y: 603, color: COLORS.infra, logo: "cookie-mcp.png" },
  { name: "CookBook", x: 176, y: 517, color: COLORS.infra, logo: "cookBook.png" },
  { name: "Metaplex", x: 160, y: 386, color: COLORS.infra, logo: "metaplex.png" },
  { name: "Cookie Quads", x: 234, y: 278, color: COLORS.infra, logo: "quads.png" },
];

/* Outer ring (r=265): user-facing apps */
const APPS_RING: OrbitNode[] = [
  { name: "CookieSwap", x: 472, y: 200, color: COLORS.defi, logo: "cookieswap.png" },
  { name: "DefiLlama", x: 563, y: 287, color: COLORS.defi, logo: "defillama.png" },
  { name: "Cookiebox", x: 604, y: 405, color: COLORS.defi, logo: "cookiebox.png" },
  { name: "Candy Shop", x: 586, y: 528, color: COLORS.defi, logo: "candy.png" },
  { name: "Nightly Wallet", x: 513, y: 630, color: COLORS.wallet, logo: "nightly.png" },
  { name: "Bake Your Stake", x: 402, y: 688, color: COLORS.defi, logo: "bakeyourstake.png" },
  { name: "Morsel Wallet", x: 278, y: 688, color: COLORS.wallet, logo: "morsel.png" },
  { name: "MomoSwap", x: 166, y: 630, color: COLORS.defi, logo: "momoswap.png" },
  { name: "Sesamians", x: 94, y: 528, color: COLORS.nft, logo: "sesamians.png" },
  { name: "CookOven", x: 76, y: 405, color: COLORS.defi, logo: "cookoven.png" },
  { name: "Baked Bazaar", x: 117, y: 287, color: COLORS.nft, logo: "bakedbazaar.png" },
  { name: "Cookie Chat", x: 207, y: 200, color: COLORS.ai, logo: "cookie-chat.png" },
];

const VALIDATORS = [
  { label: "V1", x: 414, y: 356 },
  { label: "V2", x: 414, y: 504 },
  { label: "V3", x: 266, y: 504 },
  { label: "V4", x: 266, y: 356 },
];

const STARS: [number, number, number, string][] = [
  [80, 60, 1.4, "eo-twk"], [160, 130, 1.1, ""], [255, 75, 1.3, "eo-twk2"],
  [415, 55, 1.2, ""], [505, 60, 1.4, "eo-twk"], [60, 250, 1.2, ""],
  [70, 180, 1, "eo-twk2"], [48, 640, 1.3, ""], [628, 520, 1.1, "eo-twk"],
  [636, 225, 1.2, ""], [90, 700, 1.2, "eo-twk2"],
];

const LEGEND: [string, string][] = [
  ["Validators", COLORS.validator],
  ["Infrastructure", COLORS.infra],
  ["DeFi and markets", COLORS.defi],
  ["Wallets", COLORS.wallet],
  ["NFT", COLORS.nft],
  ["AI", COLORS.ai],
  ["Memes", COLORS.meme],
];
const LEGEND_X = [70, 165, 288, 418, 486, 528, 566];

function Node({ n }: { n: OrbitNode }) {
  return (
    <g>
      {n.logo ? (
        <>
          <circle cx={n.x} cy={n.y} r={15} fill="#141B38" stroke={n.color} strokeWidth={3} />
          <clipPath id={`eo-clip-${n.name.replace(/\W/g, "")}`}>
            <circle cx={n.x} cy={n.y} r={12} />
          </clipPath>
          <image
            href={LOGO(n.logo)}
            x={n.x - 12}
            y={n.y - 12}
            width={24}
            height={24}
            clipPath={`url(#eo-clip-${n.name.replace(/\W/g, "")})`}
          />
        </>
      ) : (
        <>
          <circle cx={n.x} cy={n.y} r={15} fill={n.color} opacity={0.25} />
          <circle cx={n.x} cy={n.y} r={9} fill={n.color} />
        </>
      )}
      <text x={n.x} y={n.y + 30} fontSize={12} fontWeight={500} fill="#C9D2F0" textAnchor="middle">
        {n.name}
      </text>
    </g>
  );
}

export default function EcosystemOrbit() {
  return (
    <div style={{ maxWidth: "820px", margin: "0 auto 2.5rem" }}>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .eo-pulse { animation: eoPl 1.9s ease-in-out infinite; }
          .eo-pulse2 { animation: eoPl 1.9s ease-in-out infinite .9s; }
          .eo-twk { animation: eoTw 1.8s ease-in-out infinite; }
          .eo-twk2 { animation: eoTw 1.6s ease-in-out infinite .7s; }
          .eo-dotdn { animation: eoDn 1.9s linear infinite; }
          .eo-dotup { animation: eoUp 1.9s linear infinite .5s; }
  .eo-led1 { animation: eoLed 1.3s ease-in-out infinite; }
  .eo-led2 { animation: eoLed 1.3s ease-in-out infinite .45s; }
  .eo-led3 { animation: eoLed 1.3s ease-in-out infinite .85s; }
        }
        @keyframes eoPl { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes eoTw { 0%,100%{opacity:.25} 50%{opacity:.85} }
        @keyframes eoDn { from{transform:translateY(0)} to{transform:translateY(185px)} }
        @keyframes eoUp { from{transform:translateY(0)} to{transform:translateY(-185px)} }
      `}</style>
      <svg width="100%" viewBox="0 0 680 790" role="img" aria-label="Orbital map of the Cookie Chain ecosystem">
        <rect x={20} y={20} width={640} height={750} rx={24} fill="#0B1026" />
        {STARS.map(([x, y, r, cls], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#C9D2F0" opacity={cls ? undefined : 0.4} className={cls} />
        ))}
        <g stroke="#5B6BAA" strokeWidth={0.7} opacity={0.18}>
          {[...APPS_RING, ...INFRA].map((n) => (
            <line key={n.name} x1={340} y1={430} x2={n.x} y2={n.y} />
          ))}
        </g>
        {([[105, "#F2A93B", "2 6"], [185, "#2FBFA8", "7 7"], [265, "#8B7BF7", "14 7"]] as [number, string, string][]).map(([r, c, d]) => (
          <circle key={r} cx={340} cy={430} r={r} fill="none" stroke={c} strokeWidth={1.3} strokeDasharray={d} opacity={0.35} />
        ))}

        {/* Hyperlane beam to Solana */}
        <line x1={340} y1={124} x2={340} y2={345} stroke="#14F195" strokeWidth={7} opacity={0.15} className="eo-pulse" />
        <line x1={340} y1={124} x2={340} y2={345} stroke="#14F195" strokeWidth={2} strokeDasharray="6 5" opacity={0.8} />
        <circle cx={336} cy={132} r={3} fill="#14F195" className="eo-dotdn" />
        <circle cx={344} cy={334} r={3} fill="#9945FF" className="eo-dotup" />
        <circle cx={340} cy={240} r={14} fill="#141B38" stroke="#14F195" strokeWidth={3} />
        <clipPath id="eo-clip-hyperlane"><circle cx={340} cy={240} r={11} /></clipPath>
        <image href={LOGO("hyperlane.png")} x={329} y={229} width={22} height={22} clipPath="url(#eo-clip-hyperlane)" />
        <text x={360} y={228} fontSize={12} fill="#8A93B8">Hyperlane bridge</text>

        {/* Solana */}
        <circle cx={340} cy={92} r={38} fill="#9945FF" opacity={0.15} className="eo-pulse2" />
        <circle cx={340} cy={92} r={30} fill="#1A1033" stroke="#9945FF" strokeWidth={3} />
        <text x={340} y={96} fontSize={13} fontWeight={500} fill="#C9A8FF" textAnchor="middle">Solana</text>

        {/* Core */}
        <circle cx={340} cy={430} r={92} fill="#F2A93B" opacity={0.06} className="eo-pulse" />
        <circle cx={340} cy={430} r={80} fill="#F2A93B" opacity={0.12} />
        <circle cx={340} cy={430} r={66} fill="#E8A33D" stroke="#B87A1E" strokeWidth={3} />
        {[[310, 381], [374, 383], [295, 463], [385, 462], [340, 477]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={5} fill="#5C3A12" />
        ))}
        <text x={340} y={428} fontSize={17} fontWeight={500} fill="#3A2408" textAnchor="middle">Cookie Chain</text>
        <text x={340} y={450} fontSize={11} fill="#6B4A16" textAnchor="middle">SVM Layer 1 core</text>

        {/* Validators */}
        {VALIDATORS.map((v, i) => (
          <g key={v.label}>
            <circle cx={v.x} cy={v.y} r={27} fill="#F2A93B" opacity={0.1} />
            <rect x={v.x - 14} y={v.y - 17} width={28} height={34} rx={4} fill="#141B38" stroke="#F2A93B" strokeWidth={2} />
            {[-9, 0, 9].map((dy, j) => (
              <g key={dy}>
                <rect x={v.x - 10} y={v.y + dy - 2.5} width={15} height={5} rx={2} fill="#2E3A66" />
                <circle cx={v.x + 9} cy={v.y + dy} r={1.9} fill={j === 2 ? "#F2A93B" : "#4ADE80"} className={"eo-led" + (((i + j) % 3) + 1)} />
              </g>
            ))}
            <text x={v.x} y={v.y + 31} fontSize={11} fontWeight={500} fill="#F2A93B" textAnchor="middle">{v.label}</text>
          </g>
        ))}

        {INFRA.map((n) => <Node key={n.name} n={n} />)}
        {APPS_RING.map((n) => <Node key={n.name} n={n} />)}

        {/* Meme satellites */}
        <circle cx={598} cy={130} r={44} fill="none" stroke={COLORS.meme} strokeWidth={0.7} strokeDasharray="2 5" opacity={0.6} />
        <circle cx={598} cy={86} r={12} fill="#141B38" stroke={COLORS.meme} strokeWidth={3} />
        <clipPath id="eo-clip-gorboy"><circle cx={598} cy={86} r={11} /></clipPath>
        <image href={LOGO("gorboy.png")} x={587} y={75} width={22} height={22} clipPath="url(#eo-clip-gorboy)" />
        <text x={598} y={64} fontSize={11} fontWeight={500} fill="#FFB3CE" textAnchor="middle">GORBOY</text>
        <circle cx={598} cy={174} r={12} fill="#141B38" stroke={COLORS.meme} strokeWidth={3} />
        <clipPath id="eo-clip-gorweld"><circle cx={598} cy={174} r={11} /></clipPath>
        <image href={LOGO("gorweld.png")} x={587} y={163} width={22} height={22} clipPath="url(#eo-clip-gorweld)" />
        <text x={598} y={200} fontSize={11} fontWeight={500} fill="#FFB3CE" textAnchor="middle">GorWeld</text>

        {/* Legend */}
        {LEGEND.map(([label, color], i) => (
          <g key={label} fontSize={11}>
            <circle cx={LEGEND_X[i]} cy={740} r={5} fill={color} />
            <text x={LEGEND_X[i] + 10} y={744} fill="#8A93B8">{label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
