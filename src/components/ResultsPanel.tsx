import type { ReactNode } from "react";
import { useI18n } from "../i18n/context";
import type { CalculationResult } from "../types";

interface ResultsPanelProps {
  result: CalculationResult | null;
  isLoading: boolean;
  error: string | null;
}

const FALLBACK_RATE = 2.70;

function formatNum(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function ResultsPanel({ result, isLoading, error }: ResultsPanelProps): ReactNode {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="results-area">
        <div className="results-area__center-col results-area__center-col--empty">
          <div className="results__spinner" />
          <p className="results__empty-text">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-area">
        <div className="results-area__center-col results-area__center-col--empty">
          <svg className="results__empty-icon results__empty-icon--error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="results__empty-text results__empty-text--error">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-area">
        <div className="results-area__center-col results-area__center-col--empty">
          <svg className="results__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
          </svg>
          <p className="results__empty-text">{t.emptyHint}</p>
        </div>
      </div>
    );
  }

  const { carDetails, breakdown, totals } = result;
  const rate = totals.usdToGel || FALLBACK_RATE;

  return (
    <div className="results-area">
      {/* ── Center Column: Car + Total ── */}
      <div className="results-area__center-col">
        <div className="car-card__info">
          <h3 className="car-card__title">{carDetails.make} {carDetails.model}</h3>
          <div className="car-card__meta">
            <span className="car-card__year">{carDetails.year}</span>
            <span className="car-card__type-badge">{carDetails.type}</span>
          </div>
        </div>

        <div className="car-card__total">
          <span className="car-card__total-label">{t.totalLabel}</span>
          <span className="car-card__total-amount">
            {formatNum(totals.grandTotalGEL)} <small>GEL</small>
          </span>
          <span className="car-card__total-sub">
            ~ ${formatNum(totals.totalUSD)} USD
          </span>
          <span className="car-card__total-rate">
            {t.rateLabel} = {rate.toFixed(4)} GEL
          </span>
        </div>

        <button className="car-card__cta">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          {t.contactBtn}
        </button>
      </div>

      {/* ── Right Column: Grouped Breakdown ── */}
      <div className="results-area__breakdown-col">
        {/* Auction Costs */}
        <div className="cost-group">
          <div className="cost-group__header">
            <svg className="cost-group__icon cost-group__icon--blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" />
            </svg>
            <span className="cost-group__title">{t.auctionCosts}</span>
          </div>
          <div className="cost-group__rows">
            <div className="cost-row">
              <span className="cost-row__label">
                {t.bidLabel}
                {breakdown.isEstimatedBid && (
                  <span className="cost-row__badge cost-row__badge--estimated">{t.estimatedBadge}</span>
                )}
              </span>
              <div className="cost-row__values">
                <span className="cost-row__usd">${formatNum(breakdown.bidAmountUSD)}</span>
                <span className="cost-row__gel">{formatNum(Math.round(breakdown.bidAmountUSD * rate))} GEL</span>
              </div>
            </div>
            <div className="cost-row">
              <span className="cost-row__label">{t.buyerFeeLabel}</span>
              <div className="cost-row__values">
                <span className="cost-row__usd">${formatNum(breakdown.auctionFeeUSD)}</span>
                <span className="cost-row__gel">{formatNum(Math.round(breakdown.auctionFeeUSD * rate))} GEL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Costs */}
        <div className="cost-group">
          <div className="cost-group__header">
            <svg className="cost-group__icon cost-group__icon--green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
            </svg>
            <span className="cost-group__title">{t.shippingCosts}</span>
          </div>
          <div className="cost-group__rows">
            <div className="cost-row">
              <span className="cost-row__label">{t.inlandLabel}</span>
              <div className="cost-row__values">
                <span className="cost-row__usd">${formatNum(breakdown.shippingInlandUSD)}</span>
                <span className="cost-row__gel">{formatNum(Math.round(breakdown.shippingInlandUSD * rate))} GEL</span>
              </div>
            </div>
            <div className="cost-row">
              <span className="cost-row__label">{t.seaLabel}</span>
              <div className="cost-row__values">
                <span className="cost-row__usd">${formatNum(breakdown.shippingOceanUSD)}</span>
                <span className="cost-row__gel">{formatNum(Math.round(breakdown.shippingOceanUSD * rate))} GEL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customs Costs */}
        <div className="cost-group">
          <div className="cost-group__header">
            <svg className="cost-group__icon cost-group__icon--orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="cost-group__title">{t.customsCosts}</span>
          </div>
          <div className="cost-group__rows">
            <div className="cost-row">
              <span className="cost-row__label">{t.exciseLabel}</span>
              <div className="cost-row__values">
                <span className="cost-row__gel-main">{formatNum(breakdown.customsFeeGEL)} GEL</span>
              </div>
            </div>
            {carDetails.type === "Hybrid" && (
              <div className="cost-row cost-row--note">
                <span className="cost-row__badge cost-row__badge--green">{t.hybridBadge}</span>
                <span className="cost-row__note-text">{t.hybridNote}</span>
              </div>
            )}
            {carDetails.type === "EV" && (
              <div className="cost-row cost-row--note">
                <span className="cost-row__badge cost-row__badge--blue">{t.evBadge}</span>
                <span className="cost-row__note-text">{t.evNote}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
