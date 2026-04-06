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

const AUCTION_FEE_TIERS = [
  { max: 1000, fee: 200 },
  { max: 3000, fee: 400 },
  { max: 5000, fee: 600 },
];

const AUCTION_FEE_HIGH_RATE = 0.15;
const INTERNET_BID_FEE = 79;

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
  AUCTION_FEE_HIGH_RATE,
  INTERNET_BID_FEE,
  SHIPPING_RATES,
  SHIPPING_DEFAULT,
  CUSTOMS_AGE_COEFFICIENTS,
  CUSTOMS_OLD_COEFFICIENT,
  CUSTOMS_DECLARATION_FEE_GEL,
  HYBRID_DISCOUNT,
};
