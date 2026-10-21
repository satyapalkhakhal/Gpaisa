// Units of AngelOne's /goldhistory `rate` field — shared by server helpers and client
// components so the conversion lives in one place.
//
// The rate is INR per GRAM (24K ≈ ₹13,700 in October 2026), not per 10 g. Cross-checked
// against AngelOne's own goldcalculator (Delhi 24K: grams=1 ≈ ₹14,666, grams=10 ≈ ₹1,46,659)
// and the 1964–2026 dataset in public/ (2026: ₹1,50,500 per 10 g). Treating it as per 10 g
// showed gold at a tenth of its real price.

export function goldHistoryRatePerGram(rate: string | number): number {
    return typeof rate === 'number' ? rate : parseFloat(rate);
}

export function goldHistoryRatePer10g(rate: string | number): number {
    return goldHistoryRatePerGram(rate) * 10;
}
