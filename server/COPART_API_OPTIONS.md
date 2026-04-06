# Copart & IAAI API Options

Copart has **NO public API**. Below are alternatives for getting lot data, images, and bid history.

---

## Currently Used (Free)

| Service | URL | Purpose |
|---|---|---|
| **NHTSA VIN Decoder** | `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{vin}?format=json` | Decode VIN → make, model, year, engine, fuel type. Free, no API key. |
| **NBG Exchange Rate** | `https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json?currencies=USD` | Live USD→GEL rate from National Bank of Georgia. Free, no API key. |

---

## Paid Third-Party APIs

### auction-data.info — **RECOMMENDED**
- **URL:** https://auction-data.info/
- **Price:** $150/mo (current lots) / $200/mo (+ sales history)
- **Includes:** Unlimited requests, 3 req/sec, images, bid history, Copart + IAAI, 26M+ records
- **Best for:** Full lot data with images

### carstat.dev (via RapidAPI)
- **URL:** https://rapidapi.com/carstat-dev-carstat-dev-default/api/api-for-copart-and-iaai
- **Price:** Free trial tier available, paid tiers on RapidAPI
- **Includes:** Copart + IAAI lot data
- **Best for:** Testing/prototyping before committing to a paid plan

### AutoAstat
- **URL:** https://autoastat.com/en/pricing
- **Price:** Custom (not publicly listed)
- **Includes:** Lot photos, sales history, damage stats for Copart + IAAI

### iWebScraping
- **URL:** https://www.iwebscraping.com/copart-and-iaai-auto-auction-scraper.php
- **Price:** Custom quote
- **Includes:** Full scraping service — VIN, lot details, damage, bid price, images

---

## Free Alternatives (No API)

| Source | URL | Notes |
|---|---|---|
| **Copart CSV downloads** | https://www.copart.com/content/us/en/buyer/sales/download-sales-data | Free with buyer account. Bulk completed sale records, not real-time. |
| **BidFax / bid.cars** | https://bid.cars/en/bidfax | Free web search, historical data 2018+, no API. |
| **Poctra** | https://poctra.com/ | Free salvage auction archive, no API. |
| **Stat.vin** | https://stat.vin/ | Free VIN lookup with price estimates. |

---

## Integration Notes

To integrate a paid API, update `server/services/scraper.service.js`:

1. Add the API key to `server/.env`:
   ```
   AUCTION_API_KEY=your_key_here
   AUCTION_API_URL=https://api.example.com
   ```

2. The scraper's `scrapeVehicleData()` function is the integration point — add a new extraction method before the URL slug parser fallback.

3. Images: most paid APIs return direct image URLs that can be passed through as `vehicle.imageUrl`.
