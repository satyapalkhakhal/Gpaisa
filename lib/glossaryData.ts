export interface GlossaryTerm {
    slug: string;
    term: string;
    abbreviation?: string;
    category: 'Investing' | 'Tax' | 'Loans' | 'Savings' | 'Markets';
    shortDefinition: string;
    details: string[];
    formula?: string;
    example?: string;
    relatedCalculator?: { label: string; href: string };
    relatedTerms: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
    {
        slug: 'cagr',
        term: 'CAGR',
        abbreviation: 'Compound Annual Growth Rate',
        category: 'Investing',
        shortDefinition: 'CAGR is the average annual rate at which an investment grows over a period of years, assuming profits are reinvested each year. It smooths out year-to-year volatility into a single, comparable number.',
        details: [
            'CAGR answers the question "what constant yearly growth rate would take my starting value to my ending value over N years?" It is not the same as the actual return in any single year — those can vary widely even when CAGR looks steady.',
            'CAGR is most useful for comparing two investments of different types or holding periods on equal footing, since it strips out the effect of contribution timing and volatility.',
        ],
        formula: 'CAGR = (Final Value ÷ Initial Value)^(1 ÷ Years) − 1',
        example: 'An investment of ₹1,00,000 that grows to ₹2,00,000 in 6 years has a CAGR of about 12.25% — even if the actual year-by-year returns were +30%, −10%, +25%, and so on.',
        relatedCalculator: { label: 'CAGR Calculator', href: '/calculator/cagr' },
        relatedTerms: ['xirr', 'nav', 'mutual-fund'],
    },
    {
        slug: 'xirr',
        term: 'XIRR',
        abbreviation: 'Extended Internal Rate of Return',
        category: 'Investing',
        shortDefinition: 'XIRR is the annualised return of an investment where money goes in and out at irregular dates and amounts — like a SIP. Unlike CAGR, it correctly accounts for the exact date and size of every cash flow.',
        details: [
            'A regular SIP involves a series of separate investments made on different dates, each growing for a different length of time. CAGR cannot handle this correctly because it assumes a single lump sum invested once. XIRR solves this by finding the single discount rate that makes the present value of all your cash flows (each dated individually) equal to zero.',
            'Fund houses and platforms like Zerodha, Groww, and Kuvera report XIRR — not CAGR — for SIP portfolios, because it is the mathematically correct measure of return when contributions are staggered.',
        ],
        relatedCalculator: { label: 'SIP Calculator', href: '/calculator/sip' },
        relatedTerms: ['cagr', 'sip', 'nav'],
    },
    {
        slug: 'sip',
        term: 'SIP',
        abbreviation: 'Systematic Investment Plan',
        category: 'Investing',
        shortDefinition: 'A SIP is a method of investing a fixed amount into a mutual fund at regular intervals — usually monthly — instead of investing a lump sum all at once. It automates disciplined investing and averages your purchase cost over market ups and downs.',
        details: [
            'Because a fixed rupee amount buys more units when the fund\'s NAV is low and fewer units when it\'s high, SIPs benefit from rupee-cost averaging over volatile periods — you never have to correctly time the market.',
            'SIPs can be started with as little as ₹100–₹500 per month with most Indian mutual funds, and can be paused, stepped up, or stopped at any time without penalty (unlike ELSS SIPs, which have a 3-year lock-in per instalment).',
        ],
        formula: 'FV = P × [((1 + r)^n − 1) ÷ r] × (1 + r)',
        relatedCalculator: { label: 'SIP Calculator', href: '/calculator/sip' },
        relatedTerms: ['xirr', 'cagr', 'mutual-fund', 'nav'],
    },
    {
        slug: 'swp',
        term: 'SWP',
        abbreviation: 'Systematic Withdrawal Plan',
        category: 'Investing',
        shortDefinition: 'An SWP lets you withdraw a fixed amount from your mutual fund investment at regular intervals, while the remaining corpus stays invested and continues to grow (or shrink) with the market. It is essentially the reverse of a SIP.',
        details: [
            'SWPs are commonly used by retirees who want a predictable monthly income from a lump sum corpus without cashing out the entire investment at once — the untouched portion keeps earning returns and each withdrawal is taxed only on the gains portion, which can be more tax-efficient than an FD\'s fully taxable interest.',
            'If your withdrawal rate exceeds the fund\'s actual returns, the corpus will eventually be depleted faster than expected — always check the sustainable withdrawal rate before committing to a fixed monthly amount.',
        ],
        relatedCalculator: { label: 'SWP Calculator', href: '/calculator/swp' },
        relatedTerms: ['sip', 'mutual-fund', 'nav'],
    },
    {
        slug: 'nav',
        term: 'NAV',
        abbreviation: 'Net Asset Value',
        category: 'Investing',
        shortDefinition: 'NAV is the per-unit price of a mutual fund, calculated by dividing the total value of the fund\'s holdings (minus liabilities) by the number of outstanding units. It is published once daily after markets close.',
        details: [
            'A lower NAV does not mean a fund is "cheaper" or a better buy — two funds with identical portfolios but different NAVs (say ₹10 vs ₹500) will deliver identical percentage returns. NAV only tells you how many units your money buys, not how good the fund is.',
            'NAV is calculated as: (Total Assets − Total Liabilities) ÷ Total Outstanding Units.',
        ],
        relatedCalculator: { label: 'Mutual Fund Calculator', href: '/calculator/mutual-fund' },
        relatedTerms: ['sip', 'mutual-fund', 'expense-ratio'],
    },
    {
        slug: 'expense-ratio',
        term: 'Expense Ratio',
        category: 'Investing',
        shortDefinition: 'The expense ratio is the annual fee a mutual fund charges investors, expressed as a percentage of the fund\'s assets, to cover management, administrative, and distribution costs. It is deducted directly from the fund\'s returns before NAV is published.',
        details: [
            'SEBI caps expense ratios in India on a sliding scale by fund size and type — actively managed equity funds typically charge 1–2.25%, while index funds and ETFs charge as little as 0.1–0.5% since they require no active stock-picking.',
            'A seemingly small difference compounds significantly over long horizons: on a 20-year, ₹10,000/month SIP, a 1% higher expense ratio can cost several lakh rupees in foregone returns.',
        ],
        relatedCalculator: { label: 'Mutual Fund Calculator', href: '/calculator/mutual-fund' },
        relatedTerms: ['nav', 'mutual-fund', 'sip'],
    },
    {
        slug: 'mutual-fund',
        term: 'Mutual Fund',
        category: 'Investing',
        shortDefinition: 'A mutual fund pools money from many investors and invests it in a diversified portfolio of stocks, bonds, or other securities, managed by a professional fund manager. Investors own units of the fund proportional to their contribution.',
        details: [
            'Mutual funds are regulated by SEBI and categorised by asset class (equity, debt, hybrid) and market-cap focus (large-cap, mid-cap, small-cap, multi-cap). They can be bought as a lump sum or via SIP.',
            'Returns are not guaranteed and depend entirely on how the underlying securities perform — unlike a bank FD, the principal itself is subject to market risk.',
        ],
        relatedCalculator: { label: 'Mutual Fund Calculator', href: '/calculator/mutual-fund' },
        relatedTerms: ['sip', 'nav', 'expense-ratio', 'elss'],
    },
    {
        slug: 'elss',
        term: 'ELSS',
        abbreviation: 'Equity Linked Savings Scheme',
        category: 'Investing',
        shortDefinition: 'ELSS is a category of diversified equity mutual funds that qualifies for a tax deduction of up to ₹1.5 lakh under Section 80C of the old tax regime. It carries the shortest mandatory lock-in — just 3 years — among all Section 80C options.',
        details: [
            'Each SIP instalment into an ELSS fund has its own independent 3-year lock-in, so a SIP running for several years will have units unlocking on a rolling basis rather than all at once.',
            'ELSS is only beneficial if you\'ve opted for the old tax regime, since the new regime does not allow Section 80C deductions at all.',
        ],
        relatedCalculator: { label: 'Income Tax Calculator', href: '/calculator/income-tax' },
        relatedTerms: ['mutual-fund', 'section-80c', 'sip'],
    },
    {
        slug: 'emi',
        term: 'EMI',
        abbreviation: 'Equated Monthly Installment',
        category: 'Loans',
        shortDefinition: 'An EMI is the fixed monthly payment you make to a lender to repay a loan — home, car, or personal — over an agreed tenure. Each instalment covers a mix of principal and interest, with the interest component shrinking and the principal component growing over time.',
        details: [
            'Because EMI is calculated using the reducing-balance method, interest is charged only on the outstanding principal each month, not the original loan amount — this is why extending tenure lowers your EMI but increases the total interest paid over the loan\'s life.',
        ],
        formula: 'EMI = [P × R × (1+R)^N] ÷ [(1+R)^N − 1]',
        relatedCalculator: { label: 'EMI Calculator', href: '/calculator/emi' },
        relatedTerms: ['repo-rate', 'home-loan'],
    },
    {
        slug: 'home-loan',
        term: 'Home Loan',
        category: 'Loans',
        shortDefinition: 'A home loan is a secured loan from a bank or housing finance company used to purchase, construct, or renovate a residential property, with the property itself pledged as collateral until the loan is repaid.',
        details: [
            'Most home loans in India carry a floating interest rate linked to an External Benchmark Lending Rate (EBLR), which in turn tracks the RBI repo rate — so your EMI can rise or fall over the loan\'s life as the repo rate changes.',
            'Under Section 24(b) of the Income Tax Act, interest paid on a home loan for a self-occupied property is deductible up to ₹2 lakh per year (old tax regime only); the principal repayment separately qualifies for Section 80C.',
        ],
        relatedCalculator: { label: 'Home Loan Calculator', href: '/calculator/home-loan' },
        relatedTerms: ['emi', 'repo-rate', 'section-80c'],
    },
    {
        slug: 'repo-rate',
        term: 'Repo Rate',
        category: 'Markets',
        shortDefinition: 'The repo rate is the interest rate at which the Reserve Bank of India (RBI) lends short-term funds to commercial banks against government securities. It is the RBI\'s primary tool for controlling inflation and money supply in the economy.',
        details: [
            'When the RBI raises the repo rate, banks\' own borrowing costs rise, and they typically pass this on as higher interest rates on floating-rate home loans, car loans, and FDs. When the RBI cuts the repo rate, EMIs on floating-rate loans usually fall over the following months.',
            'Most floating-rate home loans in India are now linked to an External Benchmark Lending Rate (EBLR) tied directly to the repo rate, so RBI rate decisions flow through to borrowers\' EMIs faster than under the older base-rate system.',
        ],
        relatedCalculator: { label: 'Home Loan Calculator', href: '/calculator/home-loan' },
        relatedTerms: ['emi', 'home-loan', 'fixed-deposit'],
    },
    {
        slug: 'tds',
        term: 'TDS',
        abbreviation: 'Tax Deducted at Source',
        category: 'Tax',
        shortDefinition: 'TDS is income tax deducted upfront by the payer — a bank, employer, or company — before the money reaches you, and deposited directly with the government on your behalf. It is an advance collection of tax, not an extra tax.',
        details: [
            'On bank FD interest, TDS applies at 10% (with PAN) or 20% (without PAN) once your annual interest from that bank exceeds ₹40,000 (₹50,000 for senior citizens). If your total taxable income is below the taxable limit, you can submit Form 15G (or Form 15H for senior citizens) to prevent TDS deduction altogether.',
            'TDS deducted is not a final tax — it is adjusted against your actual tax liability when you file your Income Tax Return, and any excess is refunded.',
        ],
        relatedCalculator: { label: 'FD Calculator', href: '/calculator/fd' },
        relatedTerms: ['fixed-deposit', 'section-87a-rebate'],
    },
    {
        slug: 'fixed-deposit',
        term: 'Fixed Deposit',
        abbreviation: 'FD',
        category: 'Savings',
        shortDefinition: 'A Fixed Deposit is a lump-sum investment held with a bank or post office for a fixed tenure at a pre-agreed interest rate, which does not change even if market rates move during the term. It is one of the lowest-risk investment options in India.',
        details: [
            'Interest can be compounded quarterly, monthly, or annually and either paid out periodically or reinvested and paid at maturity, depending on the FD type. Premature withdrawal is usually allowed but attracts a penalty (typically 0.5–1% lower interest).',
            'A 5-year tax-saving FD qualifies for Section 80C deduction (old tax regime only) but comes with a mandatory 5-year lock-in and no premature withdrawal option.',
        ],
        relatedCalculator: { label: 'FD Calculator', href: '/calculator/fd' },
        relatedTerms: ['tds', 'compound-interest', 'nsc'],
    },
    {
        slug: 'compound-interest',
        term: 'Compound Interest',
        category: 'Savings',
        shortDefinition: 'Compound interest is interest calculated on both the original principal and the interest already accumulated in previous periods — meaning your money earns "interest on interest." This is what makes long-term investments grow much faster than simple interest.',
        details: [
            'The more frequently interest compounds (annually, quarterly, monthly), the faster the balance grows for the same nominal annual rate, since each compounding period adds a small amount of "interest on interest" sooner.',
        ],
        formula: 'A = P × (1 + r/n)^(n×t)',
        relatedCalculator: { label: 'FD Calculator', href: '/calculator/fd' },
        relatedTerms: ['simple-interest', 'fixed-deposit', 'cagr'],
    },
    {
        slug: 'simple-interest',
        term: 'Simple Interest',
        category: 'Savings',
        shortDefinition: 'Simple interest is calculated only on the original principal amount for the entire duration of the loan or deposit — it never earns "interest on interest." It grows linearly rather than exponentially.',
        details: [
            'Simple interest is used in a handful of specific Indian savings instruments, notably the Senior Citizens Savings Scheme (SCSS), where interest is paid out quarterly rather than compounded and reinvested.',
        ],
        formula: 'SI = (P × R × T) ÷ 100',
        relatedCalculator: { label: 'Simple Interest Calculator', href: '/calculator/simple-interest' },
        relatedTerms: ['compound-interest', 'scss'],
    },
    {
        slug: 'ppf',
        term: 'PPF',
        abbreviation: 'Public Provident Fund',
        category: 'Savings',
        shortDefinition: 'PPF is a government-backed, 15-year savings scheme open to all Indian residents, offering tax-free interest and full EEE tax status. It is one of the few investments where the deposit, the interest, and the maturity amount are all completely tax-exempt.',
        details: [
            'The interest rate is set quarterly by the Ministry of Finance and compounded annually. You can deposit between ₹500 and ₹1,50,000 per year, and the account can be extended in blocks of 5 years after the initial 15-year term, with or without further contributions.',
            'Partial withdrawals are allowed from the 7th financial year onward, and loans against the PPF balance are available between the 3rd and 6th year.',
        ],
        relatedCalculator: { label: 'PPF Calculator', href: '/calculator/ppf' },
        relatedTerms: ['epf', 'ssy', 'nsc', 'section-80c'],
    },
    {
        slug: 'epf',
        term: 'EPF',
        abbreviation: 'Employees\' Provident Fund',
        category: 'Savings',
        shortDefinition: 'EPF is a mandatory retirement savings scheme for salaried employees in India, where both the employee and employer contribute a percentage of basic salary every month. The corpus earns interest set annually by EPFO and is largely tax-free on withdrawal after 5 years of continuous service.',
        details: [
            'Employees contribute 12% of basic salary + DA; the employer matches this 12%, but 8.33% of the employer\'s share (capped at ₹1,250/month) is diverted to the Employees\' Pension Scheme (EPS) rather than the EPF account itself.',
            'Always transfer — never withdraw — your EPF balance when changing jobs, to preserve continuity for the 5-year tax-free threshold and your EPS pension eligibility.',
        ],
        relatedCalculator: { label: 'EPF Calculator', href: '/calculator/epf' },
        relatedTerms: ['ppf', 'nps', 'gratuity'],
    },
    {
        slug: 'nps',
        term: 'NPS',
        abbreviation: 'National Pension System',
        category: 'Savings',
        shortDefinition: 'NPS is a voluntary, market-linked retirement savings scheme regulated by PFRDA, where contributions are invested across equity, corporate bonds, and government securities based on your chosen allocation. At retirement, part of the corpus must be used to buy an annuity for a monthly pension.',
        details: [
            'NPS offers an additional ₹50,000 tax deduction under Section 80CCD(1B), over and above the ₹1.5 lakh Section 80C limit — a benefit no other retirement product provides. As per PFRDA\'s December 2025 rules, up to 80% of the corpus can be withdrawn as a lump sum at maturity if the total corpus is ₹5 lakh or less; otherwise, at least 40% must go toward an annuity purchase (varies by exit type).',
        ],
        relatedCalculator: { label: 'NPS Calculator', href: '/calculator/nps' },
        relatedTerms: ['epf', 'ppf', 'gratuity'],
    },
    {
        slug: 'gratuity',
        term: 'Gratuity',
        category: 'Savings',
        shortDefinition: 'Gratuity is a lump-sum payment made by an employer to an employee as a token of appreciation for continuous service of 5 years or more, payable at retirement, resignation, or termination. It is governed by the Payment of Gratuity Act, 1972, and is tax-free up to ₹20 lakh.',
        details: [
            'For employees covered under the Act, gratuity is calculated as (Last Drawn Salary × 15 × Years of Service) ÷ 26 — using a 26-day month convention, since 4 days are treated as weekly offs.',
        ],
        formula: 'Gratuity = (Last Salary × 15 × Years of Service) ÷ 26',
        relatedCalculator: { label: 'Gratuity Calculator', href: '/calculator/gratuity' },
        relatedTerms: ['epf', 'nps', 'hra'],
    },
    {
        slug: 'hra',
        term: 'HRA',
        abbreviation: 'House Rent Allowance',
        category: 'Tax',
        shortDefinition: 'HRA is a salary component paid by employers to cover an employee\'s rented accommodation costs, and is partially or fully exempt from tax under Section 10(13A) — but only under the old tax regime. The exempt amount is the lowest of three specific components, not the full HRA received.',
        details: [
            'The exemption is calculated as the minimum of: (1) actual HRA received, (2) rent paid minus 10% of Basic+DA, and (3) 50% of Basic+DA for metro cities (Delhi, Mumbai, Kolkata, Chennai) or 40% for non-metro cities.',
            'HRA exemption is not available at all under the new tax regime — the entire HRA component becomes fully taxable if you opt for it.',
        ],
        relatedCalculator: { label: 'HRA Calculator', href: '/calculator/hra' },
        relatedTerms: ['section-80c', 'old-vs-new-tax-regime', 'standard-deduction'],
    },
    {
        slug: 'gst',
        term: 'GST',
        abbreviation: 'Goods and Services Tax',
        category: 'Tax',
        shortDefinition: 'GST is a single, unified indirect tax levied on the supply of goods and services across India, replacing the earlier system of separate central and state taxes. Under GST 2.0 (effective 22 September 2025), goods and services fall into three main slabs — 5%, 18%, and 40% — plus a 0% exempt category.',
        details: [
            'For transactions within the same state, GST splits equally into CGST (Central GST) and SGST (State GST). For interstate transactions, a single IGST (Integrated GST) applies at the full rate instead.',
        ],
        relatedCalculator: { label: 'GST Calculator', href: '/calculator/gst' },
        relatedTerms: ['section-80c'],
    },
    {
        slug: 'section-80c',
        term: 'Section 80C',
        category: 'Tax',
        shortDefinition: 'Section 80C of the Income Tax Act allows a deduction of up to ₹1.5 lakh per year from taxable income for specified investments and expenses — including PPF, EPF, ELSS, life insurance premiums, NSC, and children\'s tuition fees. It is available only under the old tax regime.',
        details: [
            'The ₹1.5 lakh limit is a combined cap across all eligible instruments, not ₹1.5 lakh per instrument — so if you invest ₹1 lakh in PPF and ₹1 lakh in ELSS in the same year, only ₹1.5 lakh total is deductible, not ₹2 lakh.',
        ],
        relatedCalculator: { label: 'Income Tax Calculator', href: '/calculator/income-tax' },
        relatedTerms: ['ppf', 'elss', 'nsc', 'old-vs-new-tax-regime'],
    },
    {
        slug: 'section-87a-rebate',
        term: 'Section 87A Rebate',
        category: 'Tax',
        shortDefinition: 'The Section 87A rebate reduces your income tax liability to zero (up to a cap) if your taxable income falls below a specified threshold. For FY 2026-27, the threshold is ₹5,00,000 (rebate up to ₹12,500) under the old regime and ₹12,00,000 (rebate up to ₹60,000) under the new regime.',
        details: [
            'The rebate is applied after computing tax on the slabs but before adding surcharge and cess — so it can bring your base tax to exactly zero, but does not offset surcharge if your income is otherwise high enough to attract it (which it wouldn\'t be, given the rebate thresholds).',
        ],
        relatedCalculator: { label: 'Income Tax Calculator', href: '/calculator/income-tax' },
        relatedTerms: ['old-vs-new-tax-regime', 'standard-deduction', 'tds'],
    },
    {
        slug: 'old-vs-new-tax-regime',
        term: 'Old vs New Tax Regime',
        category: 'Tax',
        shortDefinition: 'India has two parallel income tax structures: the old regime, with higher slab rates but access to deductions like 80C, HRA, and home loan interest; and the new regime (the default since FY 2023-24), with lower slab rates and a higher tax-free threshold but almost no deductions.',
        details: [
            'Salaried individuals with no business income can switch between the two regimes every financial year when filing their return. Those with business or professional income can switch back to the old regime only once in their lifetime after opting for the new one.',
            'Broadly, taxpayers with large deductions (HRA + 80C + home loan interest) often do better under the old regime, while those with few deductions typically pay less under the new regime — but this varies by income level, so compare both directly rather than assuming.',
        ],
        relatedCalculator: { label: 'Income Tax Calculator', href: '/calculator/income-tax' },
        relatedTerms: ['section-80c', 'section-87a-rebate', 'standard-deduction', 'hra'],
    },
    {
        slug: 'standard-deduction',
        term: 'Standard Deduction',
        category: 'Tax',
        shortDefinition: 'The standard deduction is a flat amount subtracted from a salaried employee\'s or pensioner\'s gross salary before computing taxable income, with no bills or proof required. For FY 2026-27, it is ₹75,000 under the new tax regime and ₹50,000 under the old tax regime.',
        details: [
            'It applies automatically to salary and pension income only — it does not apply to income from business, profession, or capital gains.',
        ],
        relatedCalculator: { label: 'Income Tax Calculator', href: '/calculator/income-tax' },
        relatedTerms: ['old-vs-new-tax-regime', 'section-87a-rebate'],
    },
    {
        slug: 'ssy',
        term: 'Sukanya Samriddhi Yojana',
        abbreviation: 'SSY',
        category: 'Savings',
        shortDefinition: 'SSY is a government savings scheme exclusively for a girl child, opened by a parent or guardian before she turns 10. Deposits run for 15 years and the account matures 21 years after opening, with fully tax-free (EEE) interest and maturity value.',
        details: [
            'The interest rate is reviewed quarterly — 8.2% p.a. for the July–September 2026 quarter — and compounded annually. Annual deposits can range from ₹250 to ₹1,50,000.',
        ],
        relatedCalculator: { label: 'SSY Calculator', href: '/calculator/ssy' },
        relatedTerms: ['ppf', 'nsc', 'section-80c'],
    },
    {
        slug: 'nsc',
        term: 'National Savings Certificate',
        abbreviation: 'NSC',
        category: 'Savings',
        shortDefinition: 'NSC is a fixed-income government savings certificate with a 5-year tenure, offering Section 80C tax deduction on the principal and reinvested interest. Interest is compounded annually but paid out only at maturity, along with the principal.',
        details: [
            'The current rate of 7.7% p.a. (Q1 FY 2026-27) is fixed for a certificate\'s entire 5-year tenure once purchased, regardless of later quarterly rate revisions.',
        ],
        relatedCalculator: { label: 'NSC Calculator', href: '/calculator/nsc' },
        relatedTerms: ['ppf', 'ssy', 'section-80c', 'fixed-deposit'],
    },
    {
        slug: 'scss',
        term: 'Senior Citizens Savings Scheme',
        abbreviation: 'SCSS',
        category: 'Savings',
        shortDefinition: 'SCSS is a government savings scheme for individuals aged 60 and above (55+ for retired defence personnel, 50+ for VRS/superannuation retirees), offering quarterly interest payouts over a 5-year tenure, extendable once by 3 years.',
        details: [
            'Unlike PPF or NSC, SCSS interest is simple (not compounded) and paid out every quarter rather than reinvested — making it a popular option for retirees who need a predictable income stream. The maximum investment limit is ₹30 lakh per individual.',
        ],
        relatedCalculator: { label: 'SCSS Calculator', href: '/calculator/scss' },
        relatedTerms: ['nsc', 'ppf', 'simple-interest'],
    },
    {
        slug: 'sensex',
        term: 'Sensex',
        category: 'Markets',
        shortDefinition: 'Sensex is the benchmark stock market index of the Bombay Stock Exchange (BSE), tracking the performance of 30 of the largest and most actively traded Indian companies across key sectors. It is one of the two most-watched indicators of the Indian stock market\'s overall health.',
        details: [
            'Sensex is free-float market-capitalisation weighted, meaning larger companies (by tradable market value) have proportionally more influence on the index\'s movement than smaller ones.',
        ],
        relatedCalculator: { label: 'Live Market Indices', href: '/markets' },
        relatedTerms: ['nifty-50', 'demat-account'],
    },
    {
        slug: 'nifty-50',
        term: 'Nifty 50',
        category: 'Markets',
        shortDefinition: 'Nifty 50 is the benchmark stock index of the National Stock Exchange (NSE), tracking 50 of the largest companies across the major sectors of the Indian economy. Alongside Sensex, it is one of the two primary gauges of Indian equity market performance.',
        details: [
            'Nifty 50 is also free-float market-cap weighted and is reviewed and rebalanced twice a year to reflect changes in company size and eligibility.',
        ],
        relatedCalculator: { label: 'Live Market Indices', href: '/markets' },
        relatedTerms: ['sensex', 'demat-account'],
    },
    {
        slug: 'demat-account',
        term: 'Demat Account',
        category: 'Markets',
        shortDefinition: 'A Demat (dematerialised) account holds shares, bonds, and other securities in electronic form, replacing physical share certificates. It is mandatory for trading and investing in listed Indian stocks and most mutual funds.',
        details: [
            'A Demat account is typically paired with a trading account — the Demat account stores your holdings, while the trading account is used to place buy/sell orders on the stock exchange.',
        ],
        relatedCalculator: { label: 'Live Market Indices', href: '/markets' },
        relatedTerms: ['sensex', 'nifty-50', 'ipo-gmp'],
    },
    {
        slug: 'ipo-gmp',
        term: 'IPO GMP',
        abbreviation: 'Grey Market Premium',
        category: 'Markets',
        shortDefinition: 'GMP is the unofficial premium at which an IPO\'s shares trade in the "grey market" — an informal, unregulated market — before the shares are officially listed on a stock exchange. It is often used as an informal gauge of likely listing-day demand.',
        details: [
            'GMP is not a SEBI-regulated or officially reported figure, has no legal backing, and can swing sharply right up to listing day — it should be treated as a rough sentiment indicator, not a reliable predictor of listing price.',
        ],
        relatedCalculator: { label: 'IPO News', href: '/category/ipo' },
        relatedTerms: ['demat-account', 'sensex'],
    },
    {
        slug: 'gold-purity',
        term: 'Gold Purity (24K, 22K, 18K, 916)',
        category: 'Investing',
        shortDefinition: 'Gold purity is measured in Karats (K), indicating how many of 24 parts are pure gold. 24K is 99.9% pure gold; 22K (91.6% pure, marked "916") is the standard for Indian jewellery; 18K (75% pure) is common in modern, more durable jewellery designs.',
        details: [
            '24K gold is too soft for jewellery and is used mainly for coins, bars, and investment purposes. 22K and 18K gold are alloyed with metals like copper or silver for added hardness and durability, making them suitable for daily-wear jewellery. The number "916" stamped on jewellery comes from 22 ÷ 24 × 1000 = 916.',
        ],
        relatedCalculator: { label: 'Gold Rate Today', href: '/gold-rate' },
        relatedTerms: ['sensex'],
    },
];

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
    return GLOSSARY_TERMS.find((t) => t.slug === slug);
}

export function getGlossaryTermsByCategory(): Record<string, GlossaryTerm[]> {
    const grouped: Record<string, GlossaryTerm[]> = {};
    for (const term of GLOSSARY_TERMS) {
        if (!grouped[term.category]) grouped[term.category] = [];
        grouped[term.category].push(term);
    }
    for (const category in grouped) {
        grouped[category].sort((a, b) => a.term.localeCompare(b.term));
    }
    return grouped;
}
