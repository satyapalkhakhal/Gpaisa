// Historical gold price data (24K per 10g INR) — sourced from RBI/IBJA archives
// This module provides cleaned, typed access to India's gold price history from 1964–2026

export interface GoldYearlyPrice {
    year: number;
    price: number; // 24K per 10g in INR
}

/**
 * Parses raw CSV text from gold_prices_india_1964_2026.csv
 * Handles range values like "105000-130000" by averaging them
 */
export function parseGoldCSV(csvText: string): GoldYearlyPrice[] {
    const lines = csvText.trim().split('\n');
    const data: GoldYearlyPrice[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim().replace(/\r/g, '');
        if (!line) continue;

        const [yearStr, priceStr] = line.split(',');
        const year = parseInt(yearStr, 10);
        if (isNaN(year)) continue;

        let price: number;
        if (priceStr.includes('-')) {
            // Handle range like "105000-130000" → average
            const [low, high] = priceStr.split('-').map(Number);
            price = Math.round((low + high) / 2);
        } else {
            price = parseFloat(priceStr);
        }

        if (!isNaN(price)) {
            data.push({ year, price });
        }
    }

    // Sort ascending by year
    return data.sort((a, b) => a.year - b.year);
}

/**
 * Pre-parsed gold price data hardcoded from the CSV for SSR/client use
 * This avoids needing to fetch the CSV at runtime
 */
export const GOLD_HISTORICAL_DATA: GoldYearlyPrice[] = [
    { year: 1964, price: 63 },
    { year: 1965, price: 72 },
    { year: 1966, price: 84 },
    { year: 1967, price: 103 },
    { year: 1968, price: 162 },
    { year: 1969, price: 176 },
    { year: 1970, price: 184 },
    { year: 1971, price: 193 },
    { year: 1972, price: 202 },
    { year: 1973, price: 279 },
    { year: 1974, price: 506 },
    { year: 1975, price: 540 },
    { year: 1976, price: 432 },
    { year: 1977, price: 486 },
    { year: 1978, price: 685 },
    { year: 1979, price: 937 },
    { year: 1980, price: 1330 },
    { year: 1981, price: 1670 },
    { year: 1982, price: 1645 },
    { year: 1983, price: 1800 },
    { year: 1984, price: 1970 },
    { year: 1985, price: 2130 },
    { year: 1986, price: 2140 },
    { year: 1987, price: 2570 },
    { year: 1988, price: 3130 },
    { year: 1989, price: 3140 },
    { year: 1990, price: 3200 },
    { year: 1991, price: 3466 },
    { year: 1992, price: 4334 },
    { year: 1993, price: 4140 },
    { year: 1994, price: 4598 },
    { year: 1995, price: 4680 },
    { year: 1996, price: 5160 },
    { year: 1997, price: 4725 },
    { year: 1998, price: 4045 },
    { year: 1999, price: 4234 },
    { year: 2000, price: 4400 },
    { year: 2001, price: 4300 },
    { year: 2002, price: 4990 },
    { year: 2003, price: 5600 },
    { year: 2004, price: 5850 },
    { year: 2005, price: 7000 },
    { year: 2007, price: 10800 },
    { year: 2008, price: 12500 },
    { year: 2009, price: 14500 },
    { year: 2010, price: 18500 },
    { year: 2011, price: 26400 },
    { year: 2012, price: 31050 },
    { year: 2013, price: 29600 },
    { year: 2014, price: 28007 },
    { year: 2015, price: 26344 },
    { year: 2016, price: 28624 },
    { year: 2017, price: 29668 },
    { year: 2018, price: 31438 },
    { year: 2019, price: 35220 },
    { year: 2020, price: 48651 },
    { year: 2021, price: 48720 },
    { year: 2022, price: 52670 },
    { year: 2023, price: 65330 },
    { year: 2024, price: 77913 },
    { year: 2025, price: 117500 },  // avg of 105000-130000
    { year: 2026, price: 150500 },
];

export const TIME_PERIODS = [
    { label: '5Y', years: 5 },
    { label: '10Y', years: 10 },
    { label: '15Y', years: 15 },
    { label: '20Y', years: 20 },
    { label: '30Y', years: 30 },
    { label: '40Y', years: 40 },
    { label: '50Y', years: 50 },
    { label: 'All', years: 100 },
] as const;

export type TimePeriodLabel = typeof TIME_PERIODS[number]['label'];

/**
 * Filters data to the most recent N years
 */
export function filterByYears(data: GoldYearlyPrice[], years: number): GoldYearlyPrice[] {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - years;
    return data.filter(d => d.year >= startYear);
}

/**
 * Calculates CAGR between first and last data points
 */
export function calculateCAGR(data: GoldYearlyPrice[]): number {
    if (data.length < 2) return 0;
    const first = data[0];
    const last = data[data.length - 1];
    const years = last.year - first.year;
    if (years <= 0 || first.price <= 0) return 0;
    return (Math.pow(last.price / first.price, 1 / years) - 1) * 100;
}

/**
 * Calculates absolute return percentage
 */
export function calculateAbsoluteReturn(data: GoldYearlyPrice[]): number {
    if (data.length < 2) return 0;
    const first = data[0];
    const last = data[data.length - 1];
    return ((last.price - first.price) / first.price) * 100;
}

// ─── Gold Affordability Index ────────────────────────────────────────
// Measures how many grams of 24K gold a fixed ₹10,000 could buy in a given
// year. This is a pure purchasing-power-of-gold metric derived entirely from
// the verified GOLD_HISTORICAL_DATA series above — it does NOT incorporate
// wage, salary, or inflation data (no reliably verifiable year-by-year Indian
// income series exists for the full 1964–2026 span), so it should be read as
// "what a fixed rupee amount buys in gold," not "affordability relative to
// income."

export const AFFORDABILITY_REFERENCE_AMOUNT = 10000; // ₹10,000, fixed nominal reference

export interface GoldAffordabilityPoint {
    year: number;
    price: number; // 24K price per 10g, INR
    gramsPerReference: number; // grams of 24K gold ₹10,000 could buy that year
}

export function calculateGoldAffordabilityIndex(
    data: GoldYearlyPrice[] = GOLD_HISTORICAL_DATA,
    referenceAmount: number = AFFORDABILITY_REFERENCE_AMOUNT
): GoldAffordabilityPoint[] {
    return data.map((d) => ({
        year: d.year,
        price: d.price,
        gramsPerReference: Math.round((referenceAmount / d.price) * 10 * 1000) / 1000,
    }));
}
