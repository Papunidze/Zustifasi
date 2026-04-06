const { scrapeVehicleData, getCarImageUrl } = require("../services/scraper.service");
const { decodeVin, isVin } = require("../services/vinDecoder.service");
const { calculateAuctionFee } = require("../services/auctionFee.service");
const { calculateShipping } = require("../services/shipping.service");
const { calculateCustomsFee } = require("../services/customs.service");
const {
  estimateFromRetailValue,
  estimateFromManualEntry,
} = require("../services/estimateBid.service");
const { getUsdToGel } = require("../services/exchangeRate.service");
const { DUMMY_VEHICLE } = require("../utils/constants");

/**
 * POST /api/v1/calculate/link
 * Accepts { url, budgetUSD? }
 * "url" can be a Copart/IAAI link OR a 17-char VIN code.
 */
async function calculateByLink(req, res) {
  try {
    const { url, budgetUSD } = req.body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid input.",
      });
    }

    const input = url.trim();
    let vehicle = null;

    if (isVin(input)) {
      // ── VIN decode path ──
      vehicle = await decodeVin(input);
      if (!vehicle) {
        return res.status(400).json({
          success: false,
          error: "VIN ვერ მოიძებნა. გთხოვთ შეამოწმოთ და სცადოთ თავიდან.",
        });
      }
      vehicle.location = DUMMY_VEHICLE.location;
      vehicle.imageUrl = null;
    } else {
      // ── URL parse path ──
      const isValidAuctionUrl =
        input.toLowerCase().includes("copart") ||
        input.toLowerCase().includes("iaai");

      if (!isValidAuctionUrl) {
        return res.status(400).json({
          success: false,
          error: "გთხოვთ შეიყვანოთ Copart/IAAI ლინკი ან 17-ნიშნა VIN კოდი.",
        });
      }

      vehicle = await scrapeVehicleData(input);
      if (!vehicle) {
        return res.status(400).json({
          success: false,
          error: "ვერ მოიძებნა მანქანის ინფორმაცია. გთხოვთ შეამოწმოთ ლინკი.",
        });
      }
    }

    let finalBudget = budgetUSD;
    let isEstimatedBid = false;

    if (!finalBudget || typeof finalBudget !== "number" || finalBudget <= 0) {
      if (vehicle.retailValue && vehicle.retailValue > 0) {
        finalBudget = estimateFromRetailValue(vehicle.retailValue);
        console.log(
          `[CalculateController] Estimated bid from ERV ($${vehicle.retailValue}): $${finalBudget}`
        );
      } else {
        finalBudget = await estimateFromManualEntry(
          vehicle.make,
          vehicle.model,
          vehicle.year
        );
        console.log(
          `[CalculateController] Estimated bid via depreciation: $${finalBudget}`
        );
      }
      isEstimatedBid = true;
    }

    const result = await buildCalculation(vehicle, finalBudget, isEstimatedBid);
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("[CalculateController] /link error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again.",
    });
  }
}

/**
 * POST /api/v1/calculate/manual
 * Accepts { make, model, year, engineVolume, type, budgetUSD? }
 */
async function calculateManual(req, res) {
  try {
    const { make, model, year, engineVolume, type, budgetUSD } = req.body;

    if (!make || !model) {
      return res.status(400).json({
        success: false,
        error: "Missing 'make' or 'model' field.",
      });
    }

    if (!year || typeof year !== "number" || year < 1990 || year > new Date().getFullYear() + 1) {
      return res.status(400).json({
        success: false,
        error: "Invalid 'year'. Must be between 1990 and current year.",
      });
    }

    if (typeof engineVolume !== "number" || engineVolume < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid 'engineVolume'. Must be a non-negative number in liters (0 for EV).",
      });
    }

    if (type !== "EV" && engineVolume <= 0) {
      return res.status(400).json({
        success: false,
        error: "Non-EV vehicles must have an engineVolume greater than 0.",
      });
    }

    const validTypes = ["Gas", "Hybrid", "EV"];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid 'type'. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    let finalBudget = budgetUSD;
    let isEstimatedBid = false;

    if (!finalBudget || typeof finalBudget !== "number" || finalBudget <= 0) {
      finalBudget = await estimateFromManualEntry(make, model, year);
      isEstimatedBid = true;
      console.log(
        `[CalculateController] Estimated bid for ${year} ${make} ${model}: $${finalBudget}`
      );
    }

    const vehicle = {
      make,
      model,
      year,
      engineVolume,
      type,
      location: DUMMY_VEHICLE.location,
      imageUrl: getCarImageUrl(make, model, year),
    };

    const result = await buildCalculation(vehicle, finalBudget, isEstimatedBid);
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("[CalculateController] /manual error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again.",
    });
  }
}

/**
 * Core calculation logic shared by both endpoints.
 */
async function buildCalculation(vehicle, budgetUSD, isEstimatedBid) {
  const usdToGel = await getUsdToGel();

  const auctionFeeUSD = calculateAuctionFee(budgetUSD);
  const { inlandUSD, oceanUSD } = calculateShipping(vehicle.location);
  const customsFeeGEL = calculateCustomsFee(
    vehicle.engineVolume,
    vehicle.year,
    vehicle.type
  );

  const totalUSD = budgetUSD + auctionFeeUSD + inlandUSD + oceanUSD;
  const totalUSDinGEL = Math.round(totalUSD * usdToGel * 100) / 100;
  const grandTotalGEL = Math.round((totalUSDinGEL + customsFeeGEL) * 100) / 100;

  return {
    carDetails: {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      imageUrl: vehicle.imageUrl,
    },
    breakdown: {
      bidAmountUSD: budgetUSD,
      auctionFeeUSD,
      shippingInlandUSD: inlandUSD,
      shippingOceanUSD: oceanUSD,
      customsFeeGEL,
      isEstimatedBid,
    },
    totals: {
      totalUSD,
      grandTotalGEL,
      usdToGel,
    },
  };
}

module.exports = { calculateByLink, calculateManual };
