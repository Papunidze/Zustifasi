const axios = require("axios");

const NBG_API_URL =
  "https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json?currencies=USD";

const FALLBACK_RATE = 2.70;

/** Cache: { rate, fetchedAt } */
let cache = { rate: FALLBACK_RATE, fetchedAt: 0 };

/** Cache duration: 1 hour (NBG updates once daily, so this is plenty). */
const CACHE_TTL_MS = 60 * 60 * 1000;

/**
 * Fetch the current USD → GEL rate from the National Bank of Georgia.
 * Caches for 1 hour. Falls back to the last known rate or 2.70 on failure.
 *
 * @returns {Promise<number>} GEL per 1 USD.
 */
async function getUsdToGel() {
  const now = Date.now();

  if (now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.rate;
  }

  try {
    const response = await axios.get(NBG_API_URL, { timeout: 5000 });
    const data = response.data;

    // Response: [{ currencies: [{ code: "USD", rate: 2.81, quantity: 1 }] }]
    const usdEntry = data?.[0]?.currencies?.find((c) => c.code === "USD");

    if (!usdEntry || typeof usdEntry.rate !== "number" || usdEntry.rate <= 0) {
      throw new Error("Invalid rate structure from NBG API");
    }

    const rate = usdEntry.rate;
    cache = { rate, fetchedAt: now };

    console.log(`[ExchangeRate] NBG rate updated: 1 USD = ${rate} GEL`);
    return rate;
  } catch (error) {
    console.warn(
      `[ExchangeRate] NBG API failed (${error.message}). Using cached rate: ${cache.rate}`
    );
    return cache.rate;
  }
}

module.exports = { getUsdToGel };
