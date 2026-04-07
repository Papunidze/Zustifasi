const USD_TO_GEL = parseFloat(process.env.USD_TO_GEL) || 2.70;

const CURRENT_YEAR = new Date().getFullYear();

const DUMMY_VEHICLE = {
  make: "Toyota",
  model: "Camry",
  year: 2018,
  engineVolume: 2.5,
  type: "Hybrid",
  location: "Texas",
  imageUrl: null,
};

// Copart 2025 non-member fee approximation (percentage-based tiers).
// Calibrated against the published high-volume buyer fee schedule.
const AUCTION_FEE_TIERS = [
  { max: 100,   fee: 25 },
  { max: 500,   fee: 80 },
  { max: 1000,  fee: 175 },
];
const AUCTION_FEE_RATES = [
  { max: 2000,  rate: 0.145 },
  { max: 4000,  rate: 0.120 },
  { max: 6000,  rate: 0.105 },
  { max: 8000,  rate: 0.095 },
  { max: 15000, rate: 0.085 },
];
const AUCTION_FEE_HIGH_RATE = 0.075;

const INTERNET_BID_FEE = 79;
const GATE_FEE = 95;
const ENVIRONMENTAL_FEE = 15;
const TITLE_FEE = 20;
const BROKER_FEE = 250;

const GEORGIA_INLAND_USD = 250;       // Poti → Tbilisi
const INSURANCE_RATE = 0.02;          // 2% of bid value
const GE_REGISTRATION_FEE_GEL = 200;  // registration + tech inspection

const SHIPPING_RATES = {
  Texas:      { inland: 250, ocean: 1100 },
  California: { inland: 300, ocean: 1300 },
  Georgia:    { inland: 200, ocean: 1050 },
  Florida:    { inland: 280, ocean: 1150 },
  Illinois:   { inland: 320, ocean: 1200 },
};

const SHIPPING_DEFAULT = { inland: 350, ocean: 1250 };

const CUSTOMS_AGE_COEFFICIENTS = [
  { maxAge: 3,  coefficient: 1.5 },
  { maxAge: 6,  coefficient: 1.2 },
];

const CUSTOMS_OLD_COEFFICIENT = 4.5;
const CUSTOMS_DECLARATION_FEE_GEL = 150;
const HYBRID_DISCOUNT = 0.5;

module.exports = {
  USD_TO_GEL,
  CURRENT_YEAR,
  DUMMY_VEHICLE,
  AUCTION_FEE_TIERS,
  AUCTION_FEE_RATES,
  AUCTION_FEE_HIGH_RATE,
  INTERNET_BID_FEE,
  GATE_FEE,
  ENVIRONMENTAL_FEE,
  TITLE_FEE,
  BROKER_FEE,
  GEORGIA_INLAND_USD,
  INSURANCE_RATE,
  GE_REGISTRATION_FEE_GEL,
  SHIPPING_RATES,
  SHIPPING_DEFAULT,
  CUSTOMS_AGE_COEFFICIENTS,
  CUSTOMS_OLD_COEFFICIENT,
  CUSTOMS_DECLARATION_FEE_GEL,
  HYBRID_DISCOUNT,
};
