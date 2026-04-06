export interface CarDetails {
  make: string;
  model: string;
  year: number;
  type: "Gas" | "Hybrid" | "EV";
  imageUrl: string | null;
}

export interface Breakdown {
  bidAmountUSD: number;
  auctionFeeUSD: number;
  shippingInlandUSD: number;
  shippingOceanUSD: number;
  customsFeeGEL: number;
  isEstimatedBid: boolean;
}

export interface Totals {
  totalUSD: number;
  grandTotalGEL: number;
  usdToGel: number;
}

export interface CalculationResult {
  carDetails: CarDetails;
  breakdown: Breakdown;
  totals: Totals;
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

export interface ManualPayload {
  make: string;
  model: string;
  year: number;
  engineVolume: number;
  type: "Gas" | "Hybrid" | "EV";
  budgetUSD: number;
}
