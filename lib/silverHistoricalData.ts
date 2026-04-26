// Historical silver price data (per Kg INR) — sourced from RBI/IBJA archives
// 45 years of silver price data from 1981–2026

export interface SilverYearlyPrice {
    year: number;
    price: number; // per Kg in INR
}

export const SILVER_HISTORICAL_DATA: SilverYearlyPrice[] = [
    { year: 1981, price: 2715 },
    { year: 1982, price: 2720 },
    { year: 1983, price: 3105 },
    { year: 1984, price: 3570 },
    { year: 1985, price: 3955 },
    { year: 1986, price: 4015 },
    { year: 1987, price: 4794 },
    { year: 1988, price: 6066 },
    { year: 1989, price: 6755 },
    { year: 1990, price: 6463 },
    { year: 1991, price: 6646 },
    { year: 1992, price: 8040 },
    { year: 1993, price: 5489 },
    { year: 1994, price: 7124 },
    { year: 1995, price: 6335 },
    { year: 1996, price: 7346 },
    { year: 1997, price: 7345 },
    { year: 1998, price: 8560 },
    { year: 1999, price: 7615 },
    { year: 2000, price: 7900 },
    { year: 2001, price: 7215 },
    { year: 2002, price: 7875 },
    { year: 2003, price: 7695 },
    { year: 2004, price: 11770 },
    { year: 2005, price: 10675 },
    { year: 2006, price: 17405 },
    { year: 2007, price: 19520 },
    { year: 2008, price: 23625 },
    { year: 2009, price: 22165 },
    { year: 2010, price: 27255 },
    { year: 2011, price: 56900 },
    { year: 2012, price: 56290 },
    { year: 2013, price: 54030 },
    { year: 2014, price: 43070 },
    { year: 2015, price: 37825 },
    { year: 2016, price: 36990 },
    { year: 2017, price: 37825 },
    { year: 2018, price: 41400 },
    { year: 2019, price: 40600 },
    { year: 2020, price: 63435 },
    { year: 2021, price: 62572 },
    { year: 2022, price: 55100 },
    { year: 2023, price: 78600 },
    { year: 2024, price: 95700 },
    { year: 2025, price: 262000 },
    { year: 2026, price: 250000 },
];

export const SILVER_TIME_PERIODS = [
    { label: '5Y', years: 5 },
    { label: '10Y', years: 10 },
    { label: '15Y', years: 15 },
    { label: '20Y', years: 20 },
    { label: '30Y', years: 30 },
    { label: '40Y', years: 40 },
    { label: 'All', years: 100 },
] as const;

export type SilverTimePeriodLabel = typeof SILVER_TIME_PERIODS[number]['label'];

export function filterSilverByYears(data: SilverYearlyPrice[], years: number): SilverYearlyPrice[] {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - years;
    return data.filter(d => d.year >= startYear);
}

export function calculateSilverCAGR(data: SilverYearlyPrice[]): number {
    if (data.length < 2) return 0;
    const first = data[0];
    const last = data[data.length - 1];
    const years = last.year - first.year;
    if (years <= 0 || first.price <= 0) return 0;
    return (Math.pow(last.price / first.price, 1 / years) - 1) * 100;
}

export function calculateSilverAbsoluteReturn(data: SilverYearlyPrice[]): number {
    if (data.length < 2) return 0;
    const first = data[0];
    const last = data[data.length - 1];
    return ((last.price - first.price) / first.price) * 100;
}
