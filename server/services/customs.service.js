const {
  CURRENT_YEAR,
  CUSTOMS_AGE_COEFFICIENTS,
  CUSTOMS_OLD_COEFFICIENT,
  CUSTOMS_DECLARATION_FEE_GEL,
  HYBRID_DISCOUNT,
  GE_REGISTRATION_FEE_GEL,
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
  const engineVolumeCm3 = Math.ceil(engineVolumeLiters * 1000);
  const age = CURRENT_YEAR - vehicleYear;

  const ageCoefficient = getAgeCoefficient(age);
  let exciseGEL = engineVolumeCm3 * ageCoefficient;

  if (type === "EV") {
    exciseGEL = 0;
  } else if (type === "Hybrid") {
    exciseGEL = exciseGEL * HYBRID_DISCOUNT;
  }

  const exciseRounded = Math.round(exciseGEL * 100) / 100;
  const declarationGEL = CUSTOMS_DECLARATION_FEE_GEL;
  const registrationGEL = GE_REGISTRATION_FEE_GEL;
  const totalGEL =
    Math.round((exciseRounded + declarationGEL + registrationGEL) * 100) / 100;

  return {
    exciseGEL: exciseRounded,
    declarationGEL,
    registrationGEL,
    ageCoefficient,
    engineVolumeCm3,
    totalGEL,
  };
}

function getAgeCoefficient(age) {
  const tier = CUSTOMS_AGE_COEFFICIENTS.find((t) => age <= t.maxAge);
  return tier ? tier.coefficient : CUSTOMS_OLD_COEFFICIENT;
}

module.exports = { calculateCustomsFee };
