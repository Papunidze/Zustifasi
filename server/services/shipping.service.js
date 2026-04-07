const {
  SHIPPING_RATES,
  SHIPPING_DEFAULT,
  GEORGIA_INLAND_USD,
  INSURANCE_RATE,
} = require("../utils/constants");

/**
 * Returns the full shipping breakdown:
 *   inlandUSD       — US auction yard → US export port
 *   oceanUSD        — US port → Poti, Georgia
 *   geInlandUSD     — Poti → Tbilisi (Georgian inland leg)
 *   insuranceUSD    — 2% of bid value (cargo insurance)
 */
function calculateShipping(usState, bidUSD = 0) {
  const rates = SHIPPING_RATES[usState] || SHIPPING_DEFAULT;
  const insuranceUSD = Math.round(bidUSD * INSURANCE_RATE * 100) / 100;

  return {
    inlandUSD: rates.inland,
    oceanUSD: rates.ocean,
    geInlandUSD: GEORGIA_INLAND_USD,
    insuranceUSD,
  };
}

module.exports = { calculateShipping };
