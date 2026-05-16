// Bank data for Home Loan calculators
export const homeLoanBanks = [
    {
        slug: 'sbi',
        name: 'SBI',
        fullName: 'SBI Home Loan Calculator',
        description: 'Calculate SBI home loan EMI with our free calculator. Check State Bank of India home loan interest rates, eligibility, and monthly installments.',
        interestRate: 8.0, // Mid-point of 7.50–8.70%
    },
    {
        slug: 'hdfc',
        name: 'HDFC',
        fullName: 'HDFC Home Loan Calculator',
        description: 'Calculate HDFC Bank home loan EMI online. Get instant EMI calculation for HDFC home loans with competitive interest rates.',
        interestRate: 8.5, // Realistic rate for standard salaried profile
    },
    {
        slug: 'icici',
        name: 'ICICI Bank',
        fullName: 'ICICI Home Loan Calculator',
        description: 'ICICI Bank home loan EMI calculator. Calculate your monthly EMI, total interest, and loan eligibility for ICICI home loans.',
        interestRate: 8.25, // Mid-point of typical range for salaried
    },
    {
        slug: 'axis',
        name: 'Axis Bank',
        fullName: 'Axis Bank Home Loan Calculator',
        description: 'Calculate Axis Bank home loan EMI with our online calculator. Check Axis home loan interest rates and monthly payments.',
        interestRate: 8.75, // Realistic for standard profile
    },
    {
        slug: 'kotak',
        name: 'Kotak Mahindra Bank',
        fullName: 'Kotak Home Loan Calculator',
        description: 'Kotak Mahindra Bank home loan calculator. Calculate EMI, interest rates, and total payment for Kotak home loans.',
        interestRate: 8.5,
    },
    {
        slug: 'pnb',
        name: 'PNB',
        fullName: 'PNB Home Loan Calculator',
        description: 'Punjab National Bank home loan EMI calculator. Calculate PNB home loan EMI with current interest rates.',
        interestRate: 8.25,
    },
    {
        slug: 'bank-of-baroda',
        name: 'Bank of Baroda',
        fullName: 'Bank of Baroda Home Loan Calculator',
        description: 'Calculate Bank of Baroda home loan EMI online. Check BOB home loan interest rates and monthly installments.',
        interestRate: 8.1,
    },
    {
        slug: 'canara-bank',
        name: 'Canara Bank',
        fullName: 'Canara Bank Home Loan Calculator',
        description: 'Canara Bank home loan calculator. Calculate EMI, interest, and total payment for Canara Bank home loans.',
        interestRate: 8.5,
    },
    {
        slug: 'union-bank',
        name: 'Union Bank',
        fullName: 'Union Bank Home Loan Calculator',
        description: 'Union Bank of India home loan EMI calculator. Calculate your monthly EMI with Union Bank home loan rates.',
        interestRate: 8.55,
    },
    {
        slug: 'idbi',
        name: 'IDBI Bank',
        fullName: 'IDBI Home Loan Calculator',
        description: 'IDBI Bank home loan calculator. Calculate EMI, interest rates, and eligibility for IDBI home loans.',
        interestRate: 8.7,
    },
    {
        slug: 'yes-bank',
        name: 'Yes Bank',
        fullName: 'Yes Bank Home Loan Calculator',
        description: 'Calculate Yes Bank home loan EMI online. Check Yes Bank home loan interest rates and monthly payments.',
        interestRate: 8.75,
    },
    {
        slug: 'indusind',
        name: 'IndusInd Bank',
        fullName: 'IndusInd Home Loan Calculator',
        description: 'IndusInd Bank home loan EMI calculator. Calculate your monthly installments with IndusInd home loan rates.',
        interestRate: 8.8,
    },
    {
        slug: 'idfc-first',
        name: 'IDFC FIRST Bank',
        fullName: 'IDFC FIRST Home Loan Calculator',
        description: 'IDFC FIRST Bank home loan calculator. Calculate EMI and interest for IDFC FIRST home loans.',
        interestRate: 8.75,
    },
    {
        slug: 'bandhan',
        name: 'Bandhan Bank',
        fullName: 'Bandhan Bank Home Loan Calculator',
        description: 'Calculate Bandhan Bank home loan EMI online. Check Bandhan home loan rates and monthly payments.',
        interestRate: 8.85,
    },
    {
        slug: 'rbl',
        name: 'RBL Bank',
        fullName: 'RBL Bank Home Loan Calculator',
        description: 'RBL Bank home loan EMI calculator. Calculate your monthly EMI with RBL Bank home loan interest rates.',
        interestRate: 8.9,
    },
];

export type HomeLoanBank = typeof homeLoanBanks[0];

export function getHomeLoanBankBySlug(slug: string): HomeLoanBank | undefined {
    return homeLoanBanks.find(bank => bank.slug === slug);
}

export function getAllHomeLoanBankSlugs(): string[] {
    return homeLoanBanks.map(bank => bank.slug);
}
