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
      vehicle.imageUrl = await getCarImageUrl(vehicle.make, vehicle.model, vehicle.year);
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
        finalBudget = estimateFromRetailValue(vehicle.retailValue, vehicle.primaryDamage);
        console.log(
          `[CalculateController] Estimated bid from ERV ($${vehicle.retailValue}, damage=${vehicle.primaryDamage || "n/a"}): $${finalBudget}`
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
      imageUrl: await getCarImageUrl(make, model, year),
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

  const auction = calculateAuctionFee(budgetUSD);
  const { inlandUSD, oceanUSD, geInlandUSD, insuranceUSD } = calculateShipping(
    vehicle.location,
    budgetUSD
  );
  const customs = calculateCustomsFee(
    vehicle.engineVolume,
    vehicle.year,
    vehicle.type
  );

  const totalUSD =
    budgetUSD +
    auction.total +
    inlandUSD +
    oceanUSD +
    geInlandUSD +
    insuranceUSD;
  const totalUSDinGEL = Math.round(totalUSD * usdToGel * 100) / 100;
  const grandTotalGEL =
    Math.round((totalUSDinGEL + customs.totalGEL) * 100) / 100;

  return {
    carDetails: {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      imageUrl: vehicle.imageUrl,
      lotImageUrl: vehicle.lotImageUrl || null,
      primaryDamage: vehicle.primaryDamage || null,
    },
    breakdown: {
      bidAmountUSD: budgetUSD,
      auctionFeeUSD: auction.total,
      auctionFees: auction,
      shippingInlandUSD: inlandUSD,
      shippingOceanUSD: oceanUSD,
      shippingGeInlandUSD: geInlandUSD,
      insuranceUSD,
      customsFeeGEL: customs.totalGEL,
      exciseGEL: customs.exciseGEL,
      declarationGEL: customs.declarationGEL,
      registrationGEL: customs.registrationGEL,
      isEstimatedBid,
    },
    totals: {
      totalUSD,
      grandTotalGEL,
      usdToGel,
    },
  };
}

/**
 * POST /api/v1/calculate/customs
 * Customs-only quote. Accepts { year, engineVolume, type }.
 * Returns the same shape as the other endpoints with non-customs
 * sections zeroed and mode: "customs".
 */
async function calculateCustomsOnly(req, res) {
  try {
    const { year, engineVolume, type } = req.body;

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
    const validTypes = ["Gas", "Hybrid", "EV"];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid 'type'. Must be one of: ${validTypes.join(", ")}`,
      });
    }
    if (type !== "EV" && engineVolume <= 0) {
      return res.status(400).json({
        success: false,
        error: "Non-EV vehicles must have an engineVolume greater than 0.",
      });
    }

    const usdToGel = await getUsdToGel();
    const customs = calculateCustomsFee(engineVolume, year, type);

    return res.json({
      success: true,
      data: {
        mode: "customs",
        carDetails: {
          make: "",
          model: "",
          year,
          type,
          imageUrl: null,
          lotImageUrl: null,
          primaryDamage: null,
        },
        breakdown: {
          bidAmountUSD: 0,
          auctionFeeUSD: 0,
          shippingInlandUSD: 0,
          shippingOceanUSD: 0,
          shippingGeInlandUSD: 0,
          insuranceUSD: 0,
          customsFeeGEL: customs.totalGEL,
          exciseGEL: customs.exciseGEL,
          declarationGEL: customs.declarationGEL,
          registrationGEL: customs.registrationGEL,
          isEstimatedBid: false,
        },
        totals: {
          totalUSD: 0,
          grandTotalGEL: customs.totalGEL,
          usdToGel,
        },
      },
    });
  } catch (error) {
    console.error("[CalculateController] /customs error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again.",
    });
  }
}

module.exports = { calculateByLink, calculateManual, calculateCustomsOnly };
