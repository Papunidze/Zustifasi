const {
  AUCTION_FEE_TIERS,
  AUCTION_FEE_HIGH_RATE,
  INTERNET_BID_FEE,
} = require("../utils/constants");

/**
 * Calculates the total auction fee based on the bid budget.
 *
 * Tiered structure:
 *   <= $1000  → $200
 *   $1001-3000 → $400
 *   $3001-5000 → $600
 *   > $5000   → 15% of budget
 *
 * A fixed $79 internet bid fee is always added.
 */
function calculateAuctionFee(budgetUSD) {
  const tier = AUCTION_FEE_TIERS.find((t) => budgetUSD <= t.max);
  const baseFee = tier
    ? tier.fee
    : Math.round(budgetUSD * AUCTION_FEE_HIGH_RATE * 100) / 100;

  return baseFee + INTERNET_BID_FEE;
}

module.exports = { calculateAuctionFee };
