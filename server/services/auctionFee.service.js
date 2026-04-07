const {
  AUCTION_FEE_TIERS,
  AUCTION_FEE_RATES,
  AUCTION_FEE_HIGH_RATE,
  INTERNET_BID_FEE,
  GATE_FEE,
  ENVIRONMENTAL_FEE,
  TITLE_FEE,
  BROKER_FEE,
} = require("../utils/constants");

/**
 * Calculate the full auction cost for a Copart/IAAI lot.
 * Returns an itemized breakdown so the UI can display each line.
 *
 * Buyer fee approximation (Copart 2025 non-member schedule):
 *   <$100   → $25
 *   <$500   → $80
 *   <$1000  → $175
 *   <$2000  → 14.5%
 *   <$4000  → 12.0%
 *   <$6000  → 10.5%
 *   <$8000  → 9.5%
 *   <$15000 → 8.5%
 *   ≥$15000 → 7.5%
 *
 * Plus fixed fees: internet bid $79, gate $95, environmental $15,
 * title $20, broker $250 (waived for licensed members).
 */
function calculateAuctionFee(budgetUSD, opts = {}) {
  const isMember = opts.isMember === true;

  const buyerFee = calculateBuyerFee(budgetUSD);
  const brokerFee = isMember ? 0 : BROKER_FEE;

  const total =
    buyerFee +
    INTERNET_BID_FEE +
    GATE_FEE +
    ENVIRONMENTAL_FEE +
    TITLE_FEE +
    brokerFee;

  return {
    total: Math.round(total * 100) / 100,
    buyerFee: Math.round(buyerFee * 100) / 100,
    internetBidFee: INTERNET_BID_FEE,
    gateFee: GATE_FEE,
    environmentalFee: ENVIRONMENTAL_FEE,
    titleFee: TITLE_FEE,
    brokerFee,
  };
}

function calculateBuyerFee(bid) {
  const flatTier = AUCTION_FEE_TIERS.find((t) => bid < t.max);
  if (flatTier) return flatTier.fee;

  const pctTier = AUCTION_FEE_RATES.find((t) => bid < t.max);
  const rate = pctTier ? pctTier.rate : AUCTION_FEE_HIGH_RATE;
  return Math.round(bid * rate * 100) / 100;
}

module.exports = { calculateAuctionFee };
