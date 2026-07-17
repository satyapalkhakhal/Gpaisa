// Small Savings Schemes — SSY, NSC, SCSS (Q2 FY 2026-27, Jul–Sep 2026 rates)
// Rates are set quarterly by the Ministry of Finance; verify at nsiindia.gov.in
// before relying on these for a real investment decision.

export const SSY_RATE = 8.2; // % p.a., compounded annually
export const NSC_RATE = 7.7; // % p.a., compounded annually, paid at maturity
export const SCSS_RATE = 8.2; // % p.a., simple, paid quarterly

export const SSY_MIN_DEPOSIT = 250;
export const SSY_MAX_DEPOSIT = 150000;
export const SSY_DEPOSIT_YEARS = 15;
export const SSY_MATURITY_YEARS = 21;

export const NSC_MIN_INVESTMENT = 1000;
export const NSC_TENURE_YEARS = 5;

export const SCSS_MIN_INVESTMENT = 1000;
export const SCSS_MAX_INVESTMENT = 3000000;
export const SCSS_TENURE_YEARS = 5;

export interface SSYYearRow {
    year: number;
    deposit: number;
    interest: number;
    closingBalance: number;
}

export interface SSYResult {
    totalInvested: number;
    totalInterest: number;
    maturityValue: number;
    yearlyData: SSYYearRow[];
}

/**
 * Sukanya Samriddhi Yojana — deposits for 15 years from account opening,
 * account matures 21 years from opening. Interest compounded annually,
 * credited on the deposit already made for that year (deposit-then-interest).
 */
export function calculateSSY(annualDeposit: number, rate: number = SSY_RATE): SSYResult {
    let balance = 0;
    let totalInvested = 0;
    const yearlyData: SSYYearRow[] = [];

    for (let year = 1; year <= SSY_MATURITY_YEARS; year++) {
        const deposit = year <= SSY_DEPOSIT_YEARS ? annualDeposit : 0;
        balance += deposit;
        totalInvested += deposit;
        const interest = balance * (rate / 100);
        balance += interest;

        yearlyData.push({
            year,
            deposit: Math.round(deposit),
            interest: Math.round(interest),
            closingBalance: Math.round(balance),
        });
    }

    return {
        totalInvested: Math.round(totalInvested),
        totalInterest: Math.round(balance - totalInvested),
        maturityValue: Math.round(balance),
        yearlyData,
    };
}

export interface NSCResult {
    totalInvested: number;
    totalInterest: number;
    maturityValue: number;
}

/** National Savings Certificate — lump sum, compounded annually, paid at maturity (5-year tenure). */
export function calculateNSC(principal: number, rate: number = NSC_RATE, years: number = NSC_TENURE_YEARS): NSCResult {
    const maturityValue = principal * Math.pow(1 + rate / 100, years);
    return {
        totalInvested: Math.round(principal),
        totalInterest: Math.round(maturityValue - principal),
        maturityValue: Math.round(maturityValue),
    };
}

export interface SCSSResult {
    totalInvested: number;
    quarterlyPayout: number;
    annualPayout: number;
    totalInterest: number;
    maturityValue: number;
}

/** Senior Citizens Savings Scheme — lump sum, simple interest paid out quarterly (not compounded). */
export function calculateSCSS(principal: number, rate: number = SCSS_RATE, years: number = SCSS_TENURE_YEARS): SCSSResult {
    const annualPayout = principal * (rate / 100);
    const quarterlyPayout = annualPayout / 4;
    const totalInterest = annualPayout * years;

    return {
        totalInvested: Math.round(principal),
        quarterlyPayout: Math.round(quarterlyPayout),
        annualPayout: Math.round(annualPayout),
        totalInterest: Math.round(totalInterest),
        maturityValue: Math.round(principal + totalInterest),
    };
}

// ─── SSR defaults ───────────────────────────────────────────────────
export function computeSSYDefaults() {
    const annualDeposit = 50000;
    return { annualDeposit, result: calculateSSY(annualDeposit) };
}

export function computeNSCDefaults() {
    const principal = 100000;
    return { principal, result: calculateNSC(principal) };
}

export function computeSCSSDefaults() {
    const principal = 1500000;
    return { principal, result: calculateSCSS(principal) };
}
