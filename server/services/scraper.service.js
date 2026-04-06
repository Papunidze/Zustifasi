const axios = require("axios");
const cheerio = require("cheerio");
const { DUMMY_VEHICLE } = require("../utils/constants");

const STATE_ABBREVIATIONS = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
  CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho",
  IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
  KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia",
  WI: "Wisconsin", WY: "Wyoming",
};

const KNOWN_MAKES = [
  "acura", "alfa-romeo", "aston-martin", "audi", "bentley", "bmw", "buick",
  "cadillac", "chevrolet", "chrysler", "dodge", "ferrari", "fiat", "ford",
  "genesis", "gmc", "honda", "hyundai", "infiniti", "jaguar", "jeep", "kia",
  "lamborghini", "land-rover", "lexus", "lincoln", "maserati", "mazda",
  "mclaren", "mercedes-benz", "mercury", "mini", "mitsubishi", "nissan",
  "peugeot", "pontiac", "porsche", "ram", "rivian", "rolls-royce", "saab",
  "saturn", "scion", "smart", "subaru", "suzuki", "tesla", "toyota",
  "volkswagen", "volvo",
];

const ENGINE_ESTIMATES = {
  "civic": 1.5, "corolla": 1.8, "sentra": 2.0, "elantra": 2.0,
  "forte": 2.0, "mazda3": 2.0, "impreza": 2.0, "jetta": 1.4,
  "camry": 2.5, "accord": 2.0, "altima": 2.5, "sonata": 2.5,
  "k5": 2.5, "mazda6": 2.5, "legacy": 2.5, "passat": 2.0,
  "malibu": 1.5, "fusion": 2.5,
  "rav4": 2.5, "cr-v": 1.5, "rogue": 2.5, "tucson": 2.5,
  "sportage": 2.5, "cx-5": 2.5, "forester": 2.5, "escape": 1.5,
  "equinox": 1.5, "tiguan": 2.0, "outlander": 2.5,
  "highlander": 3.5, "pilot": 3.5, "pathfinder": 3.5, "palisade": 3.8,
  "telluride": 3.8, "4runner": 4.0, "explorer": 2.3, "traverse": 3.6,
  "atlas": 3.6, "sorento": 2.5, "santa-fe": 2.5, "cx-9": 2.5,
  "3-series": 2.0, "c-class": 2.0, "a4": 2.0, "is": 2.0, "g70": 2.0,
  "5-series": 3.0, "540": 3.0, "530": 2.0, "550": 4.4, "m5": 4.4,
  "440": 3.0, "430": 2.0, "m4": 3.0, "m3": 3.0, "340": 3.0, "330": 2.0,
  "e-class": 3.0, "e350": 3.5, "e450": 3.0, "a6": 3.0, "es": 3.5, "ct5": 2.0,
  "x3": 2.0, "x5": 3.0, "glc": 2.0, "gle": 2.0, "q5": 2.0,
  "rx": 3.5, "nx": 2.5, "rdx": 2.0,
  "mustang": 2.3, "camaro": 2.0, "challenger": 3.6, "charger": 3.6,
  "f-150": 3.5, "silverado": 5.3, "ram": 5.7, "sierra": 5.3,
  "tacoma": 3.5, "frontier": 3.8, "colorado": 3.6, "ranger": 2.3,
  "tundra": 3.4, "wrangler": 3.6, "grand-cherokee": 3.6,
  "model-3": 0, "model-y": 0, "model-s": 0, "model-x": 0,
  "leaf": 0, "bolt": 0, "ioniq-5": 0, "ev6": 0, "id.4": 0, "mach-e": 0,
  "prius": 1.8, "rav4-hybrid": 2.5, "camry-hybrid": 2.5,
  "accord-hybrid": 2.0, "cr-v-hybrid": 2.0, "escape-hybrid": 2.5,
  "highlander-hybrid": 2.5, "tucson-hybrid": 1.6, "sportage-hybrid": 1.6,
  "santa-fe-hybrid": 1.6, "sorento-hybrid": 1.6,
};

const EV_MODELS = [
  "model-3", "model-y", "model-s", "model-x", "leaf", "bolt", "bolt-ev",
  "bolt-euv", "ioniq-5", "ioniq-6", "ev6", "ev9", "id.4", "id-4",
  "mach-e", "mustang-mach-e", "rivian", "r1t", "r1s", "hummer-ev",
  "lyriq", "ariya", "solterra", "bz4x", "prologue", "blazer-ev",
  "equinox-ev", "e-tron", "taycan",
];

const HYBRID_KEYWORDS = [
  "hybrid", "prius", "rav4-hybrid", "camry-hybrid", "accord-hybrid",
  "cr-v-hybrid", "escape-hybrid", "highlander-hybrid", "tucson-hybrid",
  "sportage-hybrid", "santa-fe-hybrid", "sorento-hybrid", "venza",
  "maverick-hybrid",
];

/**
 * Primary strategy: parse the URL slug for vehicle data.
 * Copart URLs: /lot/LOTNUM/YEAR-MAKE-MODEL-STATE-CITY
 * IAAI URLs:   /VehicleDetail/LOTNUM~YEAR-MAKE-MODEL or /Vehicle?itemID=...
 *
 * Fallback: attempt HTML scrape.
 * Last resort: return dummy vehicle data.
 */
async function scrapeVehicleData(url) {
  const urlParsed = parseFromUrl(url);

  // Try HTML scrape to extract Est. Retail Value, even if URL parsing succeeded
  let retailValue = null;
  try {
    const htmlData = await scrapeFromHtml(url);
    retailValue = htmlData.retailValue || null;

    if (!urlParsed) {
      console.log("[ScraperService] Extracted from HTML scrape:", htmlData);
      return htmlData;
    }
  } catch (error) {
    console.warn(`[ScraperService] HTML scrape failed: ${error.message}`);
  }

  if (urlParsed) {
    urlParsed.retailValue = retailValue;
    console.log("[ScraperService] Extracted from URL slug:", urlParsed);
    return urlParsed;
  }

  // Nothing worked — return null so the controller can send a proper error
  return null;
}

/**
 * Parse vehicle info directly from the URL path.
 */
function parseFromUrl(url) {
  const isCopart = url.toLowerCase().includes("copart");
  const isIAAI = url.toLowerCase().includes("iaai");

  if (isCopart) return parseCopartUrl(url);
  if (isIAAI) return parseIAAIUrl(url);
  return null;
}

function parseCopartUrl(url) {
  // Pattern: /lot/99885295/2013-bmw-x5-xdrive35i-nj-glassboro-east
  const lotMatch = url.match(/\/lot\/(\d+)/i);
  const slugMatch = url.match(/\/lot\/\d+\/(.+)/i);
  if (!slugMatch) return null;

  const lotNumber = lotMatch ? lotMatch[1] : null;
  const slug = slugMatch[1].toLowerCase().replace(/\/$/, "");
  const parts = slug.split("-");

  if (parts.length < 3) return null;

  const year = extractYearFromParts(parts);
  if (!year) return null;

  const yearIndex = parts.indexOf(String(year));
  const remaining = parts.slice(yearIndex + 1);

  const { make, modelParts, locationParts } = extractMakeAndModel(remaining);
  if (!make) return null;

  const model = formatName(modelParts.join(" "));
  const location = resolveState(locationParts);
  const type = detectFuelType(slug, modelParts);
  const engineVolume = estimateEngine(modelParts, make, type);

  const imageUrl = buildImageUrl(formatName(make), model, year);

  return { make: formatName(make), model, year, engineVolume, type, location, imageUrl };
}

function parseIAAIUrl(url) {
  // Pattern: /VehicleDetail/LOTNUM~YEAR_MAKE_MODEL
  const tildeMatch = url.match(/VehicleDetail\/\d+~(.+)/i);
  // Pattern: /Vehicle?itemID=...&ESSION=... (no slug info)
  if (!tildeMatch) return null;

  const slug = tildeMatch[1].toLowerCase().replace(/\/$/, "");
  const parts = slug.split(/[-_]+/);

  const year = extractYearFromParts(parts);
  if (!year) return null;

  const yearIndex = parts.indexOf(String(year));
  const remaining = parts.slice(yearIndex + 1);

  const { make, modelParts } = extractMakeAndModel(remaining);
  if (!make) return null;

  const model = formatName(modelParts.join(" "));
  const type = detectFuelType(slug, modelParts);
  const engineVolume = estimateEngine(modelParts, make, type);

  const formattedMake = formatName(make);
  return {
    make: formattedMake,
    model,
    year,
    engineVolume,
    type,
    location: DUMMY_VEHICLE.location,
    imageUrl: buildImageUrl(formattedMake, model, year),
  };
}

/**
 * Build a car image URL using IMAGIN.studio CDN.
 * Returns a real render of the specific make/model/year.
 * Free tier with watermark — no API key needed.
 */
function buildImageUrl(make, model, year) {
  const cleanMake = (make || "").toLowerCase().replace(/\s+/g, "-");
  const cleanModel = (model || "")
    .toLowerCase()
    .replace(/[-\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const modelYear = year || new Date().getFullYear();

  return `https://cdn.imagin.studio/getimage?customer=img&make=${encodeURIComponent(cleanMake)}&modelFamily=${encodeURIComponent(cleanModel)}&modelYear=${modelYear}&zoomType=fullscreen&angle=23`;
}

function extractYearFromParts(parts) {
  for (const part of parts) {
    const num = parseInt(part, 10);
    if (num >= 1990 && num <= new Date().getFullYear() + 1) return num;
  }
  return null;
}

function extractMakeAndModel(remaining) {
  if (remaining.length === 0) return { make: null, modelParts: [], locationParts: [] };

  let make = null;
  let makeEndIndex = 0;

  // Try two-word makes first (land-rover, alfa-romeo, etc.)
  if (remaining.length >= 2) {
    const twoWord = `${remaining[0]}-${remaining[1]}`;
    if (KNOWN_MAKES.includes(twoWord)) {
      make = twoWord;
      makeEndIndex = 2;
    }
  }

  // Single-word make
  if (!make && KNOWN_MAKES.includes(remaining[0])) {
    make = remaining[0];
    makeEndIndex = 1;
  }

  // If not in known list, assume first part is make anyway
  if (!make) {
    make = remaining[0];
    makeEndIndex = 1;
  }

  const afterMake = remaining.slice(makeEndIndex);

  // Separate model parts from location parts.
  // Location usually starts with a 2-letter state abbreviation.
  const modelParts = [];
  const locationParts = [];
  let isLocationMode = false;

  for (const part of afterMake) {
    if (!isLocationMode && part.length === 2 && STATE_ABBREVIATIONS[part.toUpperCase()]) {
      isLocationMode = true;
      locationParts.push(part);
    } else if (isLocationMode) {
      locationParts.push(part);
    } else {
      modelParts.push(part);
    }
  }

  return { make, modelParts, locationParts };
}

function resolveState(locationParts) {
  if (locationParts.length === 0) return DUMMY_VEHICLE.location;

  const abbr = locationParts[0].toUpperCase();
  return STATE_ABBREVIATIONS[abbr] || DUMMY_VEHICLE.location;
}

function detectFuelType(slug, modelParts) {
  const combined = slug + " " + modelParts.join("-");

  if (EV_MODELS.some((ev) => combined.includes(ev))) return "EV";
  if (HYBRID_KEYWORDS.some((h) => combined.includes(h))) return "Hybrid";
  return "Gas";
}

function estimateEngine(modelParts, make, type) {
  if (type === "EV") return 0;

  // Try exact model match, then partial
  const modelSlug = modelParts.join("-");
  if (ENGINE_ESTIMATES[modelSlug] !== undefined) return ENGINE_ESTIMATES[modelSlug];

  const firstModelPart = modelParts[0];
  if (firstModelPart && ENGINE_ESTIMATES[firstModelPart] !== undefined) {
    return ENGINE_ESTIMATES[firstModelPart];
  }

  // Make-based defaults
  const makeDefaults = {
    bmw: 2.0, "mercedes-benz": 2.0, audi: 2.0, lexus: 3.5,
    porsche: 3.0, jaguar: 2.0, "land-rover": 3.0,
    toyota: 2.5, honda: 2.0, hyundai: 2.5, kia: 2.5,
    ford: 2.5, chevrolet: 2.5, nissan: 2.5, mazda: 2.5,
    subaru: 2.5, volkswagen: 2.0, volvo: 2.0,
    dodge: 3.6, chrysler: 3.6, jeep: 3.6, ram: 5.7,
  };

  return makeDefaults[make] || DUMMY_VEHICLE.engineVolume;
}

function formatName(text) {
  return text
    .split(/[-\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Fallback: try to scrape HTML (works if bot protection is off).
 */
async function scrapeFromHtml(url) {
  const response = await axios.get(url, {
    timeout: 8000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  const html = response.data;

  // Detect bot protection pages
  if (
    html.includes("_Incapsula_Resource") ||
    html.includes("cf-challenge") ||
    html.includes("Cloudflare") ||
    html.length < 2000
  ) {
    throw new Error("Bot protection detected, HTML is not usable");
  }

  const $ = cheerio.load(html);
  const isCopart = url.toLowerCase().includes("copart");

  const title = isCopart
    ? $("h1.lot-title, [data-uname='lotdetailVehicleName']").text().trim()
    : $(".inventory-details h1, .pd-title-ymm").text().trim();

  if (!title) {
    throw new Error("Could not find vehicle title in HTML");
  }

  const locationText = isCopart
    ? $("[data-uname='lotdetailSaleinformationlocation']").text().trim()
    : $(".inventory-details .location, .pd-location").text().trim();

  const engineText = isCopart
    ? $("[data-uname='lotdetailEnginetype'], .lot-detail-engine").text().trim()
    : $(".inventory-details .engine, .pd-engine").text().trim();

  const fuelText = isCopart
    ? $("[data-uname='lotdetailFueltype']").text().trim()
    : $(".inventory-details .fuel, .pd-fuel-type").text().trim();

  // Extract Est. Retail Value (ERV) from lot page
  const retailValue = extractRetailValue($, isCopart);

  const parsed = parseTitleToMakeModel(title);
  const year = extractYearFromText(title);
  const engineVolume = extractEngineVolumeFromText(engineText);
  const location = resolveStateFromText(locationText);
  const type = mapFuelTypeFromText(fuelText);

  const finalMake = parsed.make || DUMMY_VEHICLE.make;
  const finalModel = parsed.model || DUMMY_VEHICLE.model;
  return {
    make: finalMake,
    model: finalModel,
    year,
    engineVolume,
    type,
    location,
    imageUrl: buildImageUrl(finalMake, finalModel, year),
    retailValue,
  };
}

/**
 * Extract the Est. Retail Value from the parsed HTML.
 * Copart shows it as "Est. Retail Value" in lot details.
 * IAAI shows it as "Est. Retail Value" or "Estimated Retail Value".
 */
function extractRetailValue($, isCopart) {
  try {
    let text = "";

    if (isCopart) {
      // Copart: look for the ERV in lot detail labels
      text =
        $("[data-uname='lotdetailEstimatedretailvalue']").text().trim() ||
        $("label:contains('Est. Retail Value')").next().text().trim() ||
        $("span:contains('Est. Retail Value')").parent().find("span").last().text().trim() ||
        "";
    } else {
      // IAAI
      text =
        $(".pd-value-est-retail, .estimated-retail-value").text().trim() ||
        $("td:contains('Est. Retail')").next().text().trim() ||
        "";
    }

    if (!text) return null;

    // Parse "$12,500" or "12500" etc.
    const cleaned = text.replace(/[^0-9.]/g, "");
    const value = parseFloat(cleaned);
    return value > 0 ? value : null;
  } catch {
    return null;
  }
}

function parseTitleToMakeModel(title) {
  const cleaned = title.replace(/^\d{4}\s*/, "").trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 0) return { make: "", model: "" };
  if (parts.length === 1) return { make: parts[0], model: "" };
  return { make: parts[0], model: parts.slice(1).join(" ") };
}

function extractYearFromText(text) {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0], 10) : DUMMY_VEHICLE.year;
}

function extractEngineVolumeFromText(text) {
  const match = text.match(/([\d.]+)\s*[Ll]/);
  return match ? parseFloat(match[1]) : DUMMY_VEHICLE.engineVolume;
}

function resolveStateFromText(text) {
  const normalized = text.toLowerCase();
  const allStates = Object.values(STATE_ABBREVIATIONS);
  const found = allStates.find((s) => normalized.includes(s.toLowerCase()));
  return found || DUMMY_VEHICLE.location;
}

function mapFuelTypeFromText(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes("hybrid")) return "Hybrid";
  if (normalized.includes("electric") || normalized.includes("ev")) return "EV";
  return "Gas";
}

module.exports = { scrapeVehicleData, getCarImageUrl: buildImageUrl };
