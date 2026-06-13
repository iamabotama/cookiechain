# Cookie Chain — cookiechain.io

> The investor-facing website for **Cookie Chain ($COOK)** — a high-performance SVM Layer 1 built by the community that chose to stay.

[![Deploy to GitHub Pages](https://github.com/iamabotama/cookiechain/actions/workflows/deploy.yml/badge.svg)](https://github.com/iamabotama/cookiechain/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/live-cookiechain.io-7C3AED)](https://cookiechain.io)

---

## Overview

This repository contains the full source code for [cookiechain.io](https://cookiechain.io) — a professional, investor-facing website designed to present the tokenomics, governance, bridge mechanics, and ecosystem of Cookie Chain to a serious external audience.

The site is built with **React 19 + Vite + Tailwind CSS v4** and deployed as a fully static site via **GitHub Pages** to the [`iamabotama/cookiechain.io`](https://github.com/iamabotama/cookiechain.io) repository.

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, tokenomics, infrastructure, bridge, governance, ecosystem, roadmap |
| `/markets` | Live $COOK price, stats (DexScreener API), and GeckoTerminal chart embed |
| `/chain` | "The Chain" — live CookieScan explorer embed + supply facts |
| `/whitepaper` | Live-rendered whitepaper fetched from GitHub markdown source |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 + inline styles |
| UI primitives | shadcn/ui + Radix UI |
| Animation | Framer Motion + custom canvas (`StreamCanvas`) |
| Charts | Recharts (tokenomics donut) + GeckoTerminal embed |
| Live data | DexScreener public API (price/volume/liquidity) + CookieScan RPC (slot/TPS) |
| Markdown | `marked` (whitepaper rendering) |
| Package manager | pnpm |

---

## Local Development

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:3000)
pnpm dev

# Type-check
pnpm check

# Production build
pnpm build
```

The build output lands in `dist/`. A `CNAME` file containing `cookiechain.io` is automatically copied into `dist/` at build time via `vite.config.ts` so GitHub Pages serves the correct custom domain.

---

## Deployment

Deployment is fully automated via GitHub Actions. On every push to `main`:

1. The workflow installs dependencies and runs `pnpm build`
2. The `dist/` folder is force-pushed to the `main` branch of [`iamabotama/cookiechain.io`](https://github.com/iamabotama/cookiechain.io)
3. GitHub Pages serves the updated site from that repo

**Required secret:** `DEPLOY_TOKEN` — a GitHub Personal Access Token with `repo` scope, stored in this repository's **Settings → Secrets → Actions**.

See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) for the full workflow definition.

---

## DNS Configuration (IONOS)

Point your `cookiechain.io` domain to GitHub Pages with the following DNS records in IONOS:

| Type | Host | Value |
|---|---|---|
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `iamabotama.github.io` |

After DNS propagates, enable **HTTPS** in the GitHub Pages settings of `iamabotama/cookiechain.io`.

---

## Key Links

| Resource | URL |
|---|---|
| Live site | [cookiechain.io](https://cookiechain.io) |
| Deployed repo | [github.com/iamabotama/cookiechain.io](https://github.com/iamabotama/cookiechain.io) |
| CookieScan explorer | [cookiescan.io](https://cookiescan.io) |
| Whitepaper source | [github.com/iamabotama/cookienetsites/blob/main/whitepaper.md](https://github.com/iamabotama/cookienetsites/blob/main/whitepaper.md) |
| Community site | [cookiechain.wtf](https://cookiechain.wtf) |
| Twitter / X | [@TheCookieChain](https://twitter.com/TheCookieChain) |
| Telegram | [t.me/TheCookieNetChain](https://t.me/TheCookieNetChain) |

---

## License

MIT — see [`LICENSE`](LICENSE) for details.
