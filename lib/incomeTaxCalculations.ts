// Income Tax Calculator — Old vs New Regime (FY 2026-27 / AY 2027-28)
//
// Rates verified against Budget 2026 coverage (no slab changes vs FY 2025-26):
// - New regime (default, Sec 115BAC): 7 slabs, standard deduction Rs 75,000,
//   Sec 87A rebate up to Rs 60,000 for taxable income <= Rs 12,00,000.
// - Old regime: 4 slabs (age-based exemption), standard deduction Rs 50,000,
//   Sec 87A rebate up to Rs 12,500 for taxable income <= Rs 5,00,000.
// - Surcharge: 10% (>50L), 15% (>1Cr), 25% (>2Cr); old regime adds 37% (>5Cr),
//   new regime caps at 25%. 4% health & education cess on tax + surcharge.
// Marginal relief on surcharge is not applied — this affects only incomes
// sitting exactly at a surcharge threshold and is flagged in the UI disclaimer.

export type AgeCategory = 'below60' | 'senior' | 'superSenior';

export interface OldRegimeDeductions {
    section80C: number;
    homeLoanInterest: number;
    nps80CCD1B: number;
    hraExemption: number;
}

export interface TaxBreakdown {
    grossIncome: number;
    totalDeductions: number;
    taxableIncome: number;
    taxBeforeRebate: number;
    rebate: number;
    taxAfterRebate: number;
    surcharge: number;
    cess: number;
    totalTax: number;
    netTakeHome: number;
    effectiveRate: number;
}

export const STANDARD_DEDUCTION_OLD = 50000;
export const STANDARD_DEDUCTION_NEW = 75000;

const OLD_REGIME_EXEMPTION: Record<AgeCategory, number> = {
    below60: 250000,
    senior: 300000,
    superSenior: 500000,
};

function calcOldRegimeSlabTax(taxableIncome: number, ageCategory: AgeCategory): number {
    const exemption = OLD_REGIME_EXEMPTION[ageCategory];
    if (taxableIncome <= exemption) return 0;

    const slab1Top = 500000;
    const slab2Top = 1000000;
    let tax = 0;

    const slab1Amount = Math.max(0, Math.min(taxableIncome, slab1Top) - exemption);
    tax += slab1Amount * 0.05;

    if (taxableIncome > slab1Top) {
        const slab2Amount = Math.min(taxableIncome, slab2Top) - slab1Top;
        tax += slab2Amount * 0.20;
    }

    if (taxableIncome > slab2Top) {
        tax += (taxableIncome - slab2Top) * 0.30;
    }

    return tax;
}

const NEW_REGIME_SLABS = [
    { upTo: 400000, rate: 0 },
    { upTo: 800000, rate: 0.05 },
    { upTo: 1200000, rate: 0.10 },
    { upTo: 1600000, rate: 0.15 },
    { upTo: 2000000, rate: 0.20 },
    { upTo: 2400000, rate: 0.25 },
    { upTo: Infinity, rate: 0.30 },
];

function calcNewRegimeSlabTax(taxableIncome: number): number {
    let tax = 0;
    let lower = 0;
    for (const slab of NEW_REGIME_SLABS) {
        if (taxableIncome <= lower) break;
        const amountInSlab = Math.min(taxableIncome, slab.upTo) - lower;
        tax += amountInSlab * slab.rate;
        lower = slab.upTo;
    }
    return tax;
}

function calcSurcharge(tax: number, taxableIncome: number, regime: 'old' | 'new'): number {
    let rate = 0;
    if (taxableIncome > 50000000) rate = regime === 'old' ? 0.37 : 0.25;
    else if (taxableIncome > 20000000) rate = 0.25;
    else if (taxableIncome > 10000000) rate = 0.15;
    else if (taxableIncome > 5000000) rate = 0.10;
    return tax * rate;
}

function buildBreakdown(grossIncome: number, totalDeductions: number, taxableIncome: number, taxBeforeRebate: number, rebate: number, regime: 'old' | 'new'): TaxBreakdown {
    const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate);
    const surcharge = calcSurcharge(taxAfterRebate, taxableIncome, regime);
    const cess = (taxAfterRebate + surcharge) * 0.04;
    const totalTax = Math.round(taxAfterRebate + surcharge + cess);

    return {
        grossIncome: Math.round(grossIncome),
        totalDeductions: Math.round(totalDeductions),
        taxableIncome: Math.round(taxableIncome),
        taxBeforeRebate: Math.round(taxBeforeRebate),
        rebate: Math.round(rebate),
        taxAfterRebate: Math.round(taxAfterRebate),
        surcharge: Math.round(surcharge),
        cess: Math.round(cess),
        totalTax,
        netTakeHome: Math.round(grossIncome - totalTax),
        effectiveRate: grossIncome > 0 ? Number(((totalTax / grossIncome) * 100).toFixed(2)) : 0,
    };
}

export function calculateOldRegimeTax(grossIncome: number, ageCategory: AgeCategory, deductions: OldRegimeDeductions): TaxBreakdown {
    const totalDeductions =
        STANDARD_DEDUCTION_OLD +
        Math.min(Math.max(0, deductions.section80C), 150000) +
        Math.min(Math.max(0, deductions.homeLoanInterest), 200000) +
        Math.min(Math.max(0, deductions.nps80CCD1B), 50000) +
        Math.max(0, deductions.hraExemption);

    const taxableIncome = Math.max(0, grossIncome - totalDeductions);
    const taxBeforeRebate = calcOldRegimeSlabTax(taxableIncome, ageCategory);
    const rebate = taxableIncome <= 500000 ? Math.min(taxBeforeRebate, 12500) : 0;

    return buildBreakdown(grossIncome, totalDeductions, taxableIncome, taxBeforeRebate, rebate, 'old');
}

export function calculateNewRegimeTax(grossIncome: number): TaxBreakdown {
    const totalDeductions = STANDARD_DEDUCTION_NEW;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);
    const taxBeforeRebate = calcNewRegimeSlabTax(taxableIncome);
    const rebate = taxableIncome <= 1200000 ? Math.min(taxBeforeRebate, 60000) : 0;

    return buildBreakdown(grossIncome, totalDeductions, taxableIncome, taxBeforeRebate, rebate, 'new');
}

export interface IncomeTaxComparison {
    old: TaxBreakdown;
    new: TaxBreakdown;
    betterRegime: 'old' | 'new';
    savings: number;
}

export function compareRegimes(grossIncome: number, ageCategory: AgeCategory, deductions: OldRegimeDeductions): IncomeTaxComparison {
    const old = calculateOldRegimeTax(grossIncome, ageCategory, deductions);
    const newRegime = calculateNewRegimeTax(grossIncome);
    const betterRegime = old.totalTax <= newRegime.totalTax ? 'old' : 'new';
    const savings = Math.abs(old.totalTax - newRegime.totalTax);

    return { old, new: newRegime, betterRegime, savings };
}

// ─── SSR defaults: Rs 12,00,000 gross, below 60, Rs 1.5L 80C, no home loan/NPS/HRA ───
export function computeIncomeTaxDefaults() {
    const grossIncome = 1200000;
    const ageCategory: AgeCategory = 'below60';
    const deductions: OldRegimeDeductions = {
        section80C: 150000,
        homeLoanInterest: 0,
        nps80CCD1B: 0,
        hraExemption: 0,
    };

    return {
        grossIncome,
        ageCategory,
        deductions,
        comparison: compareRegimes(grossIncome, ageCategory, deductions),
    };
}
