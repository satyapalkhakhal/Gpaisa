// Pure computation helpers for values derived from raw stored figures (never stored
// themselves) — keeps EPS/P-E/NAV/etc. always in sync with the underlying financials
// instead of risking drift from a separately-entered, staleable number.
import type { Ipo, IpoFinancials } from './ipoTypes';

const CRORE = 1e7;

export interface ValuationKpis {
    eps: number | null;
    peRatio: number | null;
    ronwPercent: number | null;
    nav: number | null;
    debtToEquity: number | null;
    ebitdaMarginPercent: number | null;
    patMarginPercent: number | null;
}

/** All financial figures (revenue/PAT/net worth/etc.) are stored in ₹ Crore; shares outstanding is a raw count. */
export function computeValuationKpis(financial: IpoFinancials | undefined, ipo: Ipo): ValuationKpis {
    const shares = ipo.post_issue_shares_outstanding;
    const price = ipo.price_band_max;

    const eps = financial?.profit_after_tax != null && shares ? (financial.profit_after_tax * CRORE) / shares : null;
    const nav = financial?.net_worth != null && shares ? (financial.net_worth * CRORE) / shares : null;
    const peRatio = eps != null && eps > 0 && price != null ? price / eps : null;
    const ronwPercent = financial?.profit_after_tax != null && financial?.net_worth ? (financial.profit_after_tax / financial.net_worth) * 100 : null;
    const debtToEquity = financial?.total_debt != null && financial?.net_worth ? financial.total_debt / financial.net_worth : null;
    const ebitdaMarginPercent = financial?.ebitda != null && financial?.revenue ? (financial.ebitda / financial.revenue) * 100 : null;
    const patMarginPercent = financial?.profit_after_tax != null && financial?.revenue ? (financial.profit_after_tax / financial.revenue) * 100 : null;

    return { eps, peRatio, ronwPercent, nav, debtToEquity, ebitdaMarginPercent, patMarginPercent };
}

export interface MarketLotTier {
    label: string;
    lots: number;
    shares: number;
    amount: number;
}

/**
 * Standard retail/S-HNI/B-HNI lot tiers used industry-wide, based on SEBI's ₹2,00,000
 * retail investment cap and the conventional ₹10,00,000 S-HNI/B-HNI breakpoint.
 * Approximate/illustrative — the RHP is the authoritative source for exact tiers.
 */
export function computeMarketLotTiers(priceBandMax: number | null, lotSize: number | null): MarketLotTier[] {
    if (!priceBandMax || !lotSize) return [];
    const perLot = priceBandMax * lotSize;
    if (perLot <= 0) return [];

    const retailMaxLots = Math.max(1, Math.floor(200000 / perLot));
    const sHniMinLots = retailMaxLots + 1;
    const sHniMaxLots = Math.max(sHniMinLots, Math.floor(1000000 / perLot));
    const bHniMinLots = sHniMaxLots + 1;

    const tier = (label: string, lots: number): MarketLotTier => ({ label, lots, shares: lots * lotSize, amount: lots * perLot });

    return [
        tier('Retail (Minimum)', 1),
        tier('Retail (Maximum)', retailMaxLots),
        tier('S-HNI (Minimum)', sHniMinLots),
        tier('B-HNI (Minimum)', bHniMinLots),
    ];
}
