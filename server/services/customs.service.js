const {
  CURRENT_YEAR,
  CUSTOMS_AGE_COEFFICIENTS,
  CUSTOMS_OLD_COEFFICIENT,
  CUSTOMS_DECLARATION_FEE_GEL,
  HYBRID_DISCOUNT,
} = require("../utils/constants");

/**
 * Calculates Georgian customs/import duty in GEL.
 *
 * Base formula:  engineVolume_cm3 × ageCoefficient
 *   Age ≤ 3  → 1.5
 *   Age 4-6  → 1.2
 *   Age > 6  → 4.5 (latest law – high tariff for older cars)
 *
 * Special rules:
 *   Hybrid → 50% discount on base
 *   EV     → 100% discount (base = 0)
 *
 * A fixed 150 GEL declaration fee is always added at the end.
 */
function calculateCustomsFee(engineVolumeLiters, vehicleYear, type) {
  const engineVolumeCm3 = engineVolumeLiters * 1000;
  const age = CURRENT_YEAR - vehicleYear;

  const ageCoefficient = getAgeCoefficient(age);
  let baseFee = engineVolumeCm3 * ageCoefficient;

  if (type === "EV") {
    baseFee = 0;
  } else if (type === "Hybrid") {
    baseFee = baseFee * HYBRID_DISCOUNT;
  }

  return Math.round((baseFee + CUSTOMS_DECLARATION_FEE_GEL) * 100) / 100;
}

function getAgeCoefficient(age) {
  const tier = CUSTOMS_AGE_COEFFICIENTS.find((t) => age <= t.maxAge);
  return tier ? tier.coefficient : CUSTOMS_OLD_COEFFICIENT;
}

module.exports = { calculateCustomsFee };
