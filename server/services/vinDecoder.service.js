const axios = require("axios");

/**
 * Decode a VIN using the free NHTSA vPIC API.
 * https://vpic.nhtsa.dot.gov/api/
 *
 * Returns { make, model, year, engineVolume, type } or null on failure.
 */
async function decodeVin(vin) {
  try {
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
      { timeout: 8000 }
    );

    const results = response.data?.Results?.[0];
    if (!results || !results.Make) {
      console.warn(`[VinDecoder] No results for VIN: ${vin}`);
      return null;
    }

    const make = results.Make || "";
    const model = results.Model || "";
    const year = parseInt(results.ModelYear, 10) || 0;

    if (!make || !year) return null;

    const engineVolume = parseEngineVolume(results);
    const type = detectFuelType(results);

    console.log(
      `[VinDecoder] Decoded ${vin}: ${year} ${make} ${model} (${type}, ${engineVolume}L)`
    );

    return { make, model, year, engineVolume, type };
  } catch (error) {
    console.error(`[VinDecoder] Failed to decode ${vin}: ${error.message}`);
    return null;
  }
}

/**
 * Extract engine displacement in liters from NHTSA results.
 */
function parseEngineVolume(results) {
  // DisplacementL is the most direct field
  const displacementL = parseFloat(results.DisplacementL);
  if (displacementL > 0) return Math.round(displacementL * 10) / 10;

  // Fall back to DisplacementCC → convert to liters
  const displacementCC = parseFloat(results.DisplacementCC);
  if (displacementCC > 0) return Math.round((displacementCC / 1000) * 10) / 10;

  // EV check
  const fuelType = (results.FuelTypePrimary || "").toLowerCase();
  if (fuelType.includes("electric")) return 0;

  return 2.5; // safe default
}

/**
 * Detect fuel type from NHTSA data.
 */
function detectFuelType(results) {
  const fuelPrimary = (results.FuelTypePrimary || "").toLowerCase();
  const fuelSecondary = (results.FuelTypeSecondary || "").toLowerCase();
  const electrification = (results.ElectrificationLevel || "").toLowerCase();

  // Pure EV
  if (
    fuelPrimary.includes("electric") &&
    !fuelSecondary &&
    !fuelPrimary.includes("hybrid")
  ) {
    return "EV";
  }
  if (electrification.includes("bev") || electrification === "ev") {
    return "EV";
  }

  // Hybrid
  if (
    fuelSecondary.includes("electric") ||
    electrification.includes("hybrid") ||
    fuelPrimary.includes("hybrid")
  ) {
    return "Hybrid";
  }

  return "Gas";
}

/**
 * Check if a string looks like a VIN (17 alphanumeric chars, no I/O/Q).
 */
function isVin(input) {
  const cleaned = input.trim().toUpperCase();
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(cleaned);
}

module.exports = { decodeVin, isVin };
