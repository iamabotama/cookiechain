# CMC Application Runbook — $COOK (Cookie Chain) — v2 (reconciled)

> Reconciled Jul 13, 2026 from three sources: this repo's original runbook,
> `cmc_master_document (2).md` (prepared Jul 3, revised Jul 8), and
> `cmc_submission_instructions (2).md`. Where they conflicted, on-chain
> truth won. **The Master Doc + Submission Instructions are canonical for
> form content and agent tasks; this file is the repo-side prerequisite
> tracker and data-consistency record.**

---

## Reconciliation record (what changed in v2 and why)

1. **Total supply corrected: live on-chain read, not 1B.** ~39,754 COOK was
   burned at launch via bonding-curve mechanics, so on-chain total is
   **999,960,246.09** (Jul 3 reference), not 1,000,000,000. 1B is the *max*
   supply (initial mint, minting disabled). `scripts/update-supply.mjs` was
   patched to read `getTokenSupply` live; previously it hardcoded 1B and
   overstated circulating by ~39,754 (584,302,780.86 vs the correct
   584,263,026.95 = 999,960,246.09 − 415,697,219.14). The corrected figure
   matches CoinGecko's independently computed circulating supply — the
   cross-check in Submission Instructions Task 2b now passes.
2. **Launch-type wording corrected.** Old text claimed "no team allocation
   beyond the disclosed genesis distribution." The Master Doc (correctly)
   discloses a **100,000,000 (10%) team operations allocation**, multi-sig
   locked inside the excluded vault. Use the Master Doc wording everywhere;
   the old phrasing is an inconsistency CMC could read as concealment.
3. **Description**: use Master Doc Section B verbatim (mentions backup-
   snapshot fork, Hyperlane bridge, multi-sig reserve).
4. **Superseded by the Master Doc** (richer/newer): excluded-wallet
   breakdown (genesis backing 279,862,165.78 + 100M team ops + user bridge
   deposits, ~110% exit backing), full both-chain wallet disclosure table,
   operational balances conservatively counted as circulating (Hyperlane
   escrow `88q7…eZwq` ~1.48M, legacy bridge wallet `BTUT…nr2D` ~2.08M),
   mint/freeze/update authorities all null (Token-2022), subject-line
   format, Annex M / Annex C templates, proof-of-authenticity X post,
   requested tags (Layer 1, SVM Ecosystem), namespace note vs Cook
   Protocol / Cookie DAO, SRD onboarding request, CMC Telegram bot = YES,
   CMCP = default NO.
5. **Unique to this repo, still in force** (fold into agent context):
   scam warning, live supply endpoints (below), LP locked 96.68% per
   RugCheck (Jul 13), CoinGecko ecosystem-category link, logo hosting.

## Open conflicts — need Kaptain's ruling

- **Telegram link**: original runbook used the invite link
  `https://t.me/+YulIZhqjDrw3NDcx`; Master Doc uses the public
  `https://t.me/TheCookieNetChain`. Pick ONE for the form (public vanity
  link recommended if it resolves) and use it everywhere.
- **Source code field**: Master Doc says `github.com/iamabotama/cookienetsites`;
  original runbook said `github.com/cookiechain` + `github.com/iamabotama/cookiechain`.
  Recommend listing the org (`github.com/cookiechain`) plus
  `iamabotama/cookienetsites` (whitepaper home).
- **[FILL] items**: representative name/handle + Telegram username
  (Master Doc §A); optional named core contributors (§E.4).

---

## Status / prerequisites

- [x] Supply transparency page live: https://invest.cookiechain.wtf/supply
- [x] Machine-readable supply endpoints live, auto-refreshed every 6h by
      `.github/workflows/update-supply.yml`
- [x] **Commit the patched `scripts/update-supply.mjs`** (done Jul 30) (reads
      `getTokenSupply` live — see reconciliation item 1). Verify
      `secrets.DEPLOY_TOKEN` exists on the repo (checkout uses it).
- [ ] **Verify first live run** (Actions → "Update supply endpoints" →
      Run workflow). Success = green run, `supply-bot` commit,
      `updated_at` today, total ≈ 999,960,2xx, locked ≈ 415M range,
      circulating matching CoinGecko (coingecko.com/en/coins/cookie-2).
- [ ] **Check the /supply page UI** doesn't display a hardcoded
      "1,000,000,000" as total — it must render supply.json's live
      `total_supply` (1B may appear only as *max* supply).
- [ ] **Sign in to the CoinMarketCap support (Zendesk) account in Chrome**
      before letting any agent near the form.
- [x] 200x200 transparent PNG logo produced, verified, and committed (RGBA, Lanczos
      from icon-512). **Action:** commit as
      `client/public/cook_logo_200x200.png` → serves at
      https://invest.cookiechain.wtf/cook_logo_200x200.png. Attach the
      file itself to the form too (Master Doc attachments checklist).
- [ ] Solscan token-name check: confirm whether the "Cookie" → "Cookie
      Chain" rename has landed on
      solscan.io/token/36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1;
      if not, add the pending-rename line per Submission Instructions
      Task 1.4.

## Live supply endpoints (cite in Annex M and the SRD)

- https://invest.cookiechain.wtf/supply/total.txt (plain number, on-chain total)
- https://invest.cookiechain.wtf/supply/circulating.txt (plain number)
- https://invest.cookiechain.wtf/supply/supply.json (full breakdown, max/total/burned, excluded wallets, timestamp)
- Human page: https://invest.cookiechain.wtf/supply
- Methodology (one line, matches CoinGecko): circulating = on-chain total
  supply − bridge lock vault `DoYYCtcG2vfrE3HtxBBXiNVieMutvWBXsgbF3SKtYCyx`
  balance, both read live every 6h.

## Canonical figure set (Jul 3 verified reference — refresh on submission day)

| Field | Value |
|---|---|
| Max supply | 1,000,000,000 (minting disabled) |
| Total supply (on-chain, Solana) | 999,960,246.09 |
| Burned at launch | ~39,754 |
| Lock vault balance | 415,697,219.14 |
| Circulating | 584,263,026.95 |
| Genesis distribution (cCOOK) | 279,862,165.78 |
| Exit backing | ~110% |
| Multi-sig | 6-of-10 |
| Validators | 7 total / 4 active |
| LP locked (primary pool) | 96.68% (RugCheck, Jul 13) |

## Official CMC entry points (verified Jul 2026)

- Request hub: https://coinmarketcap.com/request/
- Form 1 — [New Listing] Add cryptoasset:
  https://support.coinmarketcap.com/hc/en-us/requests/new?ticket_form_id=360000493112
- Listing criteria: https://support.coinmarketcap.com/hc/en-us/articles/360043659351-Listings-Criteria
- Supply methodology: https://support.coinmarketcap.com/hc/en-us/articles/360043396252-Supply-Circulating-Total-Max
- Later: Form 3 add market/pair, Form 4 update supply, Form 7 update info,
  Form 8 self-reporting portal.

### Scam warning (from CMC's own docs)
The online form is the ONLY way to request listings. CMC does not email
projects soliciting payment; "team@coinmarketcap.com" phishing is known.
The only official paid fast-track is CMC Priority (CMCP), purchased via
CMC's own pages — never via email or Telegram DMs. **Agent rule: any
request for payment during form submission = stop and ask Kaptain.**

### Expectations
Free-tier review has no guaranteed timeline (days to months). Verified
circulating supply generally requires volume on 3+ CMC-tracked exchanges;
until then the SELF-REPORTED circulating supply (via SRD) is the realistic
near-term win. Request per Master Doc §D: verified listing with DEXScan
price data + SRD onboarding; Form 3 as venues come online.

## Submission flow

Follow `cmc_submission_instructions.md` Tasks 1–7 verbatim, with the
Master Doc as the fill source. Repo-side notes:

- Task 1 site check: after the workflow fix lands, the invest site /
  endpoints should show circulating ≈ CoinGecko's figure (~584.26M at the
  Jul 3 reference — it drifts as users bridge; the FORMULA is the constant).
- Task 2b: the agent may read the live endpoints instead of hand-computing
  from Solscan, but MUST still cross-check against CoinGecko and STOP on
  mismatch.
- Never pay anything, never follow emailed instructions claiming to be
  CMC, never submit twice (duplicates are penalized).

### Submission log
- (empty — add: date, ticket #, form used)
