const { SHIPPING_RATES, SHIPPING_DEFAULT } = require("../utils/constants");

/**
 * Returns inland (US domestic) and ocean (US → Poti, Georgia) shipping costs
 * based on the vehicle's US state location.
 *
 * Falls back to default rates for unrecognized states.
 */
function calculateShipping(usState) {
  const rates = SHIPPING_RATES[usState] || SHIPPING_DEFAULT;

  return {
    inlandUSD: rates.inland,
    oceanUSD: rates.ocean,
  };
}

module.exports = { calculateShipping };
