# ZustiFasi — Upgrade & Accuracy Roadmap

A focused list of tips to make the **car-import-to-Georgia** calculator more accurate, trustworthy, and feature-rich. Organized by domain with priority tags: **[P0]** critical, **[P1]** high-value, **[P2]** nice-to-have.

---

## 1. Customs / Import Duty (`server/services/customs.service.js`)

Current logic uses 3 flat age tiers (≤3, 4–6, >6) × engine cm³, with hybrid 50% / EV 100% discount. The real Georgian customs formula is far more granular.

- **[P0] Use the official Revenue Service (RS.ge) formula.** Georgian import duty is calculated per-cm³ with a rate that depends on *both* engine size brackets *and* age brackets (0, 1, 2, 3, 4, 5, 6, 7–12, 13+ years), not three flat tiers. Replace `CUSTOMS_AGE_COEFFICIENTS` with the full matrix from rs.ge.
- **[P0] Add excise tax ("აქციზი") as a separate line.** Import duty and excise are two different taxes in Georgia — currently they appear merged. Split them in the breakdown.
- **[P0] Add 18% VAT ("დღგ").** VAT is charged on (CIF value + duty + excise) and is the single largest tax for most imports. It is missing from the current calculation entirely.
- **[P1] Engine-volume rounding.** RS rounds cm³ up to the nearest whole number before applying the coefficient — mirror that.
- **[P1] Special categories:** pickup trucks, cargo vans, and motorcycles use different coefficients. Add a `bodyType` field and branch on it.
- **[P1] EV exemption sunset.** The 100% EV exemption has expiration conditions tied to year of manufacture — encode the cutoff rather than hard-coding `baseFee = 0`.
- **[P2] Right-hand-drive penalty.** RHD vehicles are banned/penalized — warn the user at input time.

## 2. Auction Fees (`server/services/auctionFee.service.js`)

Current logic: 4 flat tiers + 15% above $5k + fixed $79 internet fee.

- **[P0] Copart and IAAI have different fee schedules** — split into `copart.fees.js` and `iaai.fees.js`. Detect source from URL.
- **[P0] Real Copart fee table has ~15 tiers** up to $15k, then a percentage — replace the 4-tier approximation with the full published table.
- **[P0] Add missing fees:** Gate Fee (~$95), Environmental Fee (~$15), Title Fee (~$20), Virtual Bid Fee (varies by bid), and Broker Fee (if user is not a licensed member — typically $200–$500).
- **[P1] Member vs. non-member pricing.** Non-members pay a Broker Fee; expose a toggle.
- **[P1] "Clean title" vs. "salvage/rebuildable"** can affect fees and eligibility — read from the scraper.

## 3. Shipping (`server/services/shipping.service.js`)

Current: per-US-state lookup returning `{inland, ocean}`.

- **[P0] Inland shipping should be port-based, not state-based.** Real quotes depend on (origin auction yard ZIP → destination US port: Newark, Savannah, Houston, Long Beach). Use the auction yard's actual address from the scraper.
- **[P0] Ocean rate varies by destination port + season + container type.** Most GE imports go via Poti or Batumi through RoRo or container. Add `shippingMethod: 'RoRo' | 'Container40' | 'ContainerShared'`.
- **[P1] Integrate a live rates API** (e.g., SGT, Westgate, IAA-Shipping) or at least a monthly-updated JSON of rates.
- **[P1] Add Poti → Tbilisi (or user city) inland leg in Georgia.** Currently the calculation stops at the port.
- **[P2] Add insurance option** (typically 1.5–2.5% of declared value).

## 4. Bid Estimation (`server/services/estimateBid.service.js`)

- **[P1] Replace depreciation heuristic with real market data.** Scrape Copart/IAAI sold-history for the same make/model/year/damage type — median of last 30 days is far more accurate than a depreciation curve.
- **[P1] Factor in damage severity** (Primary Damage field: Front End, Rear, Flood, Burn…). A flood title drops value 40–60%.
- **[P2] Odometer trust flag.** Include the `TMU` (True Mileage Unknown) status in the estimate.

## 5. Exchange Rate (`server/services/exchangeRate.service.js`)

- **[P0] Use the official NBG (National Bank of Georgia) rate**, not a generic FX API. Customs is calculated at the NBG rate on the date of declaration. Endpoint: `https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json/`.
- **[P1] Cache the rate for 1 hour** and show "as of <timestamp>" in the UI.
- **[P2] Show both "today's rate" and "rate +2% buffer"** so users see a realistic worst case.

## 6. Scraper (`server/services/scraper.service.js`)

- **[P1] Pull additional fields:** lot number, sale date, primary damage, secondary damage, odometer, keys present, airbags deployed, run & drive status. All of these affect true landed cost and buyer risk.
- **[P1] Handle Copart's Cloudflare / bot protection** with a headless browser pool or a paid proxy — pure HTTP scraping breaks frequently.
- **[P2] Cache scraped lots for 10 minutes** keyed by lot number.

## 7. VIN Decoder (`server/services/vinDecoder.service.js`)

- **[P1] Fall back to multiple providers** (NHTSA is free but incomplete for European/Asian VINs — add a paid fallback like Auto.dev or VinAudit).
- **[P2] Surface recall data** from NHTSA's recalls endpoint.

## 8. Frontend / UX (`src/components/`)

- **[P0] Show the full breakdown** — not just totals. Users should see: bid, auction fees (itemized), US inland, ocean, GE inland, insurance, customs duty, excise, VAT, declaration fee, broker commission.
- **[P1] Add a "confidence indicator"** on each line (Live / Estimated / Static).
- **[P1] Save/share calculation** via a short URL (store snapshot in DB).
- **[P1] PDF export** of the quote.
- **[P1] Language: add English alongside Georgian** (i18n folder already exists — finish it).
- **[P2] Comparison mode** — paste 2–3 lots and compare side-by-side.
- **[P2] Watchlist + price alerts** when a lot drops below a user-set threshold.
- **[P2] Dark mode + mobile polish.**

## 9. Data Layer

- **[P1] Move constants out of `utils/constants.js` into a versioned `fees.json`** with an `effectiveDate`. Georgian tax law changes — you want history, not code edits.
- **[P1] Persist calculations to a DB** (Postgres/SQLite) for analytics and user history.
- **[P2] Admin panel** to update fee tables without a deploy.

## 10. Code Quality / Architecture

- **[P0] Migrate `server/` to TypeScript.** Zero `any`, strict interfaces — mirrors the global 2026 standards already used on the frontend.
- **[P0] Unit tests for every pricing service** (`customs`, `auctionFee`, `shipping`) with fixture cases pulled from real published RS.ge examples. Pricing bugs = user trust loss.
- **[P1] Result/Option pattern** for service returns instead of `null` / throws.
- **[P1] Separate domain / infra layers** — current controllers mix validation, orchestration, and HTTP concerns.
- **[P1] Add request validation with Zod** on both endpoints.
- **[P2] OpenAPI spec** generated from the code, replacing the Postman collection as source-of-truth.

## 11. New Features Worth Adding

- **[P1] "Total cost of ownership" view:** add registration in Georgia (~150–300 GEL), tech inspection, first-year insurance estimate.
- **[P1] Profit calculator for resellers:** enter expected local sale price → see net margin.
- **[P1] Auction calendar** — pull upcoming sales for the watched make/model.
- **[P2] Telegram bot** that accepts a Copart link and returns the calculation — Georgian buyers live in Telegram.
- **[P2] Damage-photo AI pre-assessment** using a vision model to flag likely hidden damage.

---

## Suggested Execution Order

1. **Accuracy foundation** — NBG rate, full customs matrix, VAT + excise split, itemized breakdown UI. *(P0 cluster — without this the tool is misleading.)*
2. **Fee realism** — real Copart/IAAI tables, port-based shipping, GE inland leg.
3. **Trust & transparency** — confidence indicators, versioned fees.json, unit tests.
4. **Growth features** — PDF export, share link, English i18n, Telegram bot.

---

*Generated 2026-04-07. Review quarterly — Georgian import law and auction fee schedules change frequently.*
