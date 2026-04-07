export interface CarDetails {
  make: string;
  model: string;
  year: number;
  type: "Gas" | "Hybrid" | "EV";
  imageUrl: string | null;
  lotImageUrl?: string | null;
  primaryDamage?: string | null;
}

export interface AuctionFees {
  total: number;
  buyerFee: number;
  internetBidFee: number;
  gateFee: number;
  environmentalFee: number;
  titleFee: number;
  brokerFee: number;
}

export interface Breakdown {
  bidAmountUSD: number;
  auctionFeeUSD: number;
  auctionFees?: AuctionFees;
  shippingInlandUSD: number;
  shippingOceanUSD: number;
  shippingGeInlandUSD?: number;
  insuranceUSD?: number;
  customsFeeGEL: number;
  exciseGEL?: number;
  declarationGEL?: number;
  registrationGEL?: number;
  isEstimatedBid: boolean;
}

export interface Totals {
  totalUSD: number;
  grandTotalGEL: number;
  usdToGel: number;
}

export interface CalculationResult {
  mode?: "full" | "customs";
  carDetails: CarDetails;
  breakdown: Breakdown;
  totals: Totals;
}

export interface CustomsPayload {
  year: number;
  engineVolume: number;
  type: "Gas" | "Hybrid" | "EV";
}

export interface ApiResponse {
  success: boolean;
  data?: CalculationResult;
  error?: string;
}

export interface LinkPayload {
  url: string;
  budgetUSD: number;
}

export interface VinDecoded {
  make: string;
  model: string;
  year: number;
  engineVolume: number;
  type: "Gas" | "Hybrid" | "EV";
}

export interface VinResponse {
  success: boolean;
  data?: VinDecoded;
  error?: string;
}

export interface ManualPayload {
  make: string;
  model: string;
  year: number;
  engineVolume: number;
  type: "Gas" | "Hybrid" | "EV";
  budgetUSD: number;
}
