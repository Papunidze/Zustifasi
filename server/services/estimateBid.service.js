const axios = require("axios");
const { CURRENT_YEAR } = require("../utils/constants");

/**
 * Estimate the winning bid for a vehicle at Copart/IAAI.
 *
 * Strategy 1 (URL-based): Use Est. Retail Value from the lot page.
 *   Clean title: ERV * 0.65  |  Salvage: ERV * 0.45
 *
 * Strategy 2 (Manual): Try external valuation API, then fall back
 *   to a research-based depreciation model.
 *
 * Data sources:
 *   - KBB depreciation curves (2025-2026)
 *   - Verified Copart sales data (2025-2026)
 *   - RideSafely salvage value guide (2025)
 *   - Average transaction prices from Cox Automotive (2025)
 */

const VALUATION_API_KEY = process.env.VALUATION_API_KEY || "";
const VALUATION_API_URL =
  process.env.VALUATION_API_URL ||
  "https://mc-api.marketcheck.com/v2/predict/car/price";

/**
 * Estimate bid from the Est. Retail Value scraped from the lot page.
 * Copart listings are typically salvage — auction price ~ 45% of ERV.
 * Clean titles go higher, around 65% of ERV.
 * We use 50% as a middle ground since we can't always detect title type.
 */
function estimateFromRetailValue(retailValue, primaryDamage = null) {
  const base = retailValue * 0.50;
  const adjusted = base * getDamageMultiplier(primaryDamage);
  return Math.max(Math.round(adjusted), 500);
}

/**
 * Map a Copart/IAAI primary-damage label to a value multiplier.
 * Conservative numbers based on auction sale-history medians.
 *
 *   Normal Wear / None        → 1.00
 *   Front End / Rear End      → 0.85
 *   Side / Hail / Vandalism   → 0.80
 *   All Over / Undercarriage  → 0.70
 *   Roll Over / Major Dent    → 0.60
 *   Mechanical / Frame Damage → 0.55
 *   Flood / Burn / Stripped   → 0.40
 */
function getDamageMultiplier(damage) {
  if (!damage) return 1.0;
  const d = damage.toLowerCase();

  if (d.includes("flood") || d.includes("burn") || d.includes("strip")) return 0.40;
  if (d.includes("roll") || d.includes("frame") || d.includes("mechanic")) return 0.55;
  if (d.includes("all over") || d.includes("under")) return 0.70;
  if (d.includes("side") || d.includes("hail") || d.includes("vandal")) return 0.80;
  if (d.includes("front") || d.includes("rear")) return 0.85;
  if (d.includes("normal") || d.includes("minor") || d.includes("none")) return 1.0;
  return 0.85;
}

/**
 * Estimate bid for a manually entered vehicle.
 * Manual entries assume the user is shopping for a specific car,
 * so we estimate what a clean/lightly-damaged unit would sell for.
 */
async function estimateFromManualEntry(make, model, year) {
  try {
    if (!VALUATION_API_KEY) {
      throw new Error("No VALUATION_API_KEY configured");
    }

    const response = await axios.get(VALUATION_API_URL, {
      params: {
        api_key: VALUATION_API_KEY,
        make,
        model,
        year,
        car_type: "used",
      },
      timeout: 5000,
      headers: { Accept: "application/json" },
    });

    const price =
      response.data?.price ||
      response.data?.predicted_price ||
      response.data?.wholesale_price ||
      null;

    if (price && typeof price === "number" && price > 0) {
      // Wholesale/private party price → auction is ~70% of that
      return Math.round(price * 0.70);
    }

    throw new Error("Invalid price from valuation API");
  } catch (error) {
    console.warn(
      `[EstimateBidService] API unavailable (${error.message}). Using depreciation model.`
    );
    return estimateByDepreciation(make, model, year);
  }
}

// ─── MSRP Database (2024-2025 average transaction prices) ───────────────

const MODEL_MSRP = {
  // BMW
  "bmw x5": 66000, "bmw x3": 50000, "bmw x7": 82000, "bmw x1": 40000,
  "bmw 3 series": 46000, "bmw 320": 42000, "bmw 330": 46000, "bmw 340": 54000,
  "bmw 5 series": 58000, "bmw 520": 54000, "bmw 530": 58000, "bmw 540": 62000, "bmw 550": 72000,
  "bmw 7 series": 96000, "bmw 740": 96000, "bmw 750": 108000, "bmw 760": 120000,
  "bmw 4 series": 52000, "bmw 430": 48000, "bmw 440": 56000,
  "bmw x6": 72000, "bmw x4": 54000, "bmw i4": 54000, "bmw ix": 88000,
  "bmw m3": 76000, "bmw m4": 78000, "bmw m5": 108000, "bmw m8": 130000,

  // Mercedes
  "mercedes gle": 62000, "mercedes glc": 50000, "mercedes gls": 84000,
  "mercedes c-class": 46000, "mercedes c": 46000, "mercedes c300": 46000,
  "mercedes e-class": 58000, "mercedes e": 58000, "mercedes e350": 58000, "mercedes e450": 66000,
  "mercedes s-class": 118000, "mercedes s": 118000, "mercedes s500": 118000, "mercedes s580": 128000,
  "mercedes g-class": 145000, "mercedes gla": 40000, "mercedes glb": 42000,
  "mercedes eqb": 54000, "mercedes eqe": 78000, "mercedes eqs": 108000,

  // Audi
  "audi q5": 48000, "audi q7": 62000, "audi q8": 74000, "audi a4": 42000,
  "audi a6": 58000, "audi a8": 90000, "audi e-tron": 72000, "audi q3": 38000,

  // Lexus
  "lexus rx": 52000, "lexus nx": 42000, "lexus es": 44000, "lexus gx": 66000,
  "lexus lx": 92000, "lexus is": 42000, "lexus tx": 58000,

  // Toyota
  "toyota camry": 30000, "toyota corolla": 24000, "toyota rav4": 34000,
  "toyota highlander": 42000, "toyota 4runner": 44000, "toyota tacoma": 38000,
  "toyota tundra": 46000, "toyota prius": 32000, "toyota land cruiser": 58000,
  "toyota sienna": 40000, "toyota venza": 36000,

  // Honda
  "honda civic": 26000, "honda accord": 30000, "honda cr-v": 34000,
  "honda pilot": 42000, "honda hr-v": 28000, "honda odyssey": 40000,
  "honda ridgeline": 42000,

  // Hyundai
  "hyundai tucson": 32000, "hyundai santa fe": 36000, "hyundai palisade": 44000,
  "hyundai elantra": 24000, "hyundai sonata": 30000, "hyundai ioniq 5": 46000,
  "hyundai ioniq 6": 48000, "hyundai kona": 28000,

  // Kia
  "kia sportage": 32000, "kia sorento": 36000, "kia telluride": 42000,
  "kia k5": 30000, "kia forte": 22000, "kia ev6": 48000, "kia ev9": 58000,
  "kia carnival": 38000,

  // Ford
  "ford f-150": 58000, "ford explorer": 42000, "ford escape": 34000,
  "ford bronco": 42000, "ford mustang": 36000, "ford maverick": 28000,
  "ford expedition": 64000, "ford mustang mach-e": 48000, "ford ranger": 36000,

  // Chevrolet
  "chevrolet silverado": 54000, "chevrolet equinox": 32000, "chevrolet traverse": 38000,
  "chevrolet tahoe": 62000, "chevrolet suburban": 66000, "chevrolet camaro": 34000,
  "chevrolet corvette": 72000, "chevrolet colorado": 36000,

  // Tesla
  "tesla model 3": 42000, "tesla model y": 48000, "tesla model s": 82000,
  "tesla model x": 90000, "tesla cybertruck": 78000,

  // Porsche
  "porsche cayenne": 82000, "porsche macan": 62000, "porsche 911": 120000,
  "porsche taycan": 92000, "porsche panamera": 98000,

  // Jeep
  "jeep grand cherokee": 46000, "jeep wrangler": 42000, "jeep wagoneer": 68000,
  "jeep gladiator": 44000, "jeep compass": 32000, "jeep cherokee": 36000,

  // Dodge / Ram
  "dodge charger": 38000, "dodge challenger": 38000, "dodge durango": 44000,
  "ram 1500": 52000, "ram 2500": 58000, "ram 3500": 62000,

  // Nissan
  "nissan rogue": 32000, "nissan pathfinder": 40000, "nissan altima": 28000,
  "nissan sentra": 22000, "nissan frontier": 38000, "nissan titan": 52000,
  "nissan ariya": 46000,

  // Subaru
  "subaru outback": 34000, "subaru forester": 34000, "subaru crosstrek": 30000,
  "subaru wrx": 34000, "subaru ascent": 38000,

  // Volkswagen
  "volkswagen tiguan": 34000, "volkswagen atlas": 40000, "volkswagen id.4": 44000,
  "volkswagen jetta": 24000, "volkswagen taos": 28000,

  // Volvo
  "volvo xc90": 58000, "volvo xc60": 48000, "volvo xc40": 40000,
  "volvo s60": 42000, "volvo ex30": 38000, "volvo ex90": 82000,

  // GMC
  "gmc sierra": 56000, "gmc yukon": 66000, "gmc acadia": 40000,
  "gmc canyon": 38000, "gmc hummer ev": 98000,

  // Others
  "genesis g70": 44000, "genesis g80": 56000, "genesis gv70": 48000,
  "genesis gv80": 58000, "cadillac escalade": 82000, "cadillac ct5": 40000,
  "land rover range rover": 108000, "land rover range rover sport": 84000,
  "land rover defender": 58000, "jaguar f-pace": 52000,
  "rivian r1s": 78000, "rivian r1t": 74000,
  "lincoln navigator": 82000, "lincoln aviator": 58000,
};

// Make-level fallback MSRPs
const MAKE_MSRP = {
  bmw: 58000, mercedes: 56000, audi: 52000, lexus: 50000,
  porsche: 92000, jaguar: 52000, "land rover": 72000, genesis: 50000,
  cadillac: 54000, lincoln: 58000, volvo: 48000, "alfa romeo": 46000,
  maserati: 88000, bentley: 220000, "rolls-royce": 380000,
  ferrari: 320000, lamborghini: 280000, mclaren: 240000,
  toyota: 36000, honda: 32000, hyundai: 32000, kia: 34000,
  nissan: 32000, ford: 42000, chevrolet: 40000, mazda: 32000,
  subaru: 34000, volkswagen: 34000, chrysler: 38000,
  dodge: 40000, jeep: 42000, ram: 54000, gmc: 50000,
  buick: 38000, mitsubishi: 30000, mini: 36000,
  tesla: 52000, rivian: 76000, polestar: 52000,
};

// ─── Depreciation Curve ─────────────────────────────────────────────────

/**
 * Depreciation curve: % of MSRP retained by age.
 * Based on KBB/CarEdge 2025-2026 data.
 *
 * Luxury brands depreciate ~5-8% faster per year than mainstream.
 */
const LUXURY_MAKES = new Set([
  "bmw", "mercedes", "audi", "lexus", "porsche", "jaguar",
  "land rover", "genesis", "cadillac", "lincoln", "volvo",
  "maserati", "bentley", "rolls-royce", "ferrari", "lamborghini",
  "mclaren", "alfa romeo", "infiniti", "acura",
]);

/**
 * Returns the fraction of MSRP a car retains at a given age.
 */
function getRetentionRate(age, isLuxury) {
  // Mainstream retention rates (% of MSRP)
  const mainstream = [
    1.00,  // 0 years (new)
    0.81,  // 1 year
    0.69,  // 2 years
    0.60,  // 3 years
    0.52,  // 4 years
    0.44,  // 5 years
    0.38,  // 6 years
    0.33,  // 7 years
    0.29,  // 8 years
    0.25,  // 9 years
    0.22,  // 10 years
    0.19,  // 11 years
    0.17,  // 12 years
    0.15,  // 13 years
    0.13,  // 14 years
    0.11,  // 15+ years
  ];

  // Luxury depreciates faster but popular models retain well
  const luxury = [
    1.00,  // 0
    0.78,  // 1
    0.66,  // 2
    0.57,  // 3
    0.49,  // 4
    0.42,  // 5
    0.36,  // 6
    0.31,  // 7
    0.27,  // 8
    0.23,  // 9
    0.20,  // 10
    0.17,  // 11
    0.15,  // 12
    0.13,  // 13
    0.11,  // 14
    0.09,  // 15+
  ];

  const table = isLuxury ? luxury : mainstream;
  const index = Math.min(age, table.length - 1);
  return table[Math.max(0, index)];
}

// ─── Auction Discount ───────────────────────────────────────────────────

/**
 * Auction prices vs. retail (private party) value:
 *   - Clean title at auction: ~65-70% of retail
 *   - Salvage/damage title: ~40-55% of retail
 *
 * Since manual entry users are estimating for planning purposes,
 * we assume a lightly-damaged/clean unit: ~65% of retail value.
 * This gives realistic "what will I likely pay at Copart" numbers.
 */
const AUCTION_TO_RETAIL_RATIO = 0.65;

// ─── Main Functions ─────────────────────────────────────────────────────

/**
 * Look up MSRP for a specific make + model, falling back to make average.
 */
function getMsrp(make, model) {
  const key = `${make} ${model}`.toLowerCase().trim();

  // Try exact model match
  if (MODEL_MSRP[key]) return MODEL_MSRP[key];

  // Try partial match (e.g. "bmw x5 xdrive40i" → "bmw x5")
  const modelKeys = Object.keys(MODEL_MSRP);
  const partial = modelKeys.find((k) => key.startsWith(k) || k.startsWith(key));
  if (partial) return MODEL_MSRP[partial];

  // Fall back to make-level average
  const makeLower = make.toLowerCase().trim();
  return MAKE_MSRP[makeLower] || 36000;
}

/**
 * Estimate auction bid using depreciation model.
 *
 * Formula:
 *   retailValue = MSRP × retentionRate(age, luxury)
 *   auctionBid  = retailValue × AUCTION_TO_RETAIL_RATIO
 *   floor: $1,500
 *
 * Example: 2021 BMW X5 in 2026
 *   MSRP: $66,000
 *   Age: 5 → retention 0.38 (luxury) → retail $25,080
 *   Auction: $25,080 × 0.65 = $16,302
 *   Hmm still low... BMW X5 retains value better.
 *
 * Actually auction prices for popular models often EXCEED KBB retail
 * due to dealer demand. So we use 0.65 of MSRP-based retail as
 * a conservative estimate, and add a popularity multiplier for
 * high-demand models.
 */

const HIGH_DEMAND_MODELS = new Set([
  "bmw x5", "bmw x3", "bmw 540", "bmw 530", "bmw 440", "mercedes gle", "mercedes glc", "lexus rx",
  "toyota 4runner", "toyota tacoma", "toyota tundra", "toyota land cruiser",
  "jeep wrangler", "ford f-150", "chevrolet tahoe", "chevrolet suburban",
  "porsche cayenne", "porsche 911", "land rover defender",
  "gmc yukon", "cadillac escalade", "ford bronco", "tesla model y",
  "tesla model 3", "hyundai palisade", "kia telluride",
  "ram 1500", "chevrolet silverado", "gmc sierra",
]);

function estimateByDepreciation(make, model, year) {
  const msrp = getMsrp(make, model);
  const age = Math.max(0, CURRENT_YEAR - year);
  const isLuxury = LUXURY_MAKES.has(make.toLowerCase().trim());

  const retention = getRetentionRate(age, isLuxury);
  const retailValue = msrp * retention;

  // Auction bid as fraction of retail
  let auctionBid = retailValue * AUCTION_TO_RETAIL_RATIO;

  // High-demand models get a 20% premium at auction
  const modelKey = `${make} ${model}`.toLowerCase().trim();
  const isHighDemand = HIGH_DEMAND_MODELS.has(modelKey) ||
    [...HIGH_DEMAND_MODELS].some((k) => modelKey.startsWith(k));

  if (isHighDemand) {
    auctionBid *= 1.20;
  }

  const result = Math.round(auctionBid);

  console.log(
    `[EstimateBid] ${year} ${make} ${model}: MSRP=$${msrp}, age=${age}, ` +
    `retention=${(retention * 100).toFixed(0)}%, retail=$${Math.round(retailValue)}, ` +
    `auction=$${result}${isHighDemand ? " (high demand +20%)" : ""}`
  );

  return Math.max(result, 1500);
}

module.exports = {
  estimateFromRetailValue,
  estimateFromManualEntry,
  getDamageMultiplier,
};
