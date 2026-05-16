// Extended bank-specific home loan data for SEO content sections
// Used by BankSpecificContent.tsx for server-side rendered bank pages

export interface BankHomeLoanData {
  slug: string
  bankName: string
  defaultRate: number
  regularRateText: string
  nriRateText: string
  usp: string
  processingFee: string
  maxTenure: string
  minCibil: string
  metaTitle: string
  metaDescription: string
  intro: string
}

export const bankHomeLoanData: BankHomeLoanData[] = [
  {
    slug: "sbi-home-loan-calculator",
    bankName: "State Bank of India (SBI)",
    defaultRate: 8.00,
    regularRateText: "7.50% – 8.70%*",
    nriRateText: "~7.75% onwards*",
    usp: "SBI MaxGain overdraft facility — park surplus funds in your loan account to reduce interest burden without formal prepayment",
    processingFee: "0.35% + GST (min ₹2,000, max ₹10,000)",
    maxTenure: "30 years",
    minCibil: "650",
    metaTitle: "SBI Home Loan EMI Calculator 2026 — Rates, NRI Rates & MaxGain | gpaisa.in",
    metaDescription: "Calculate SBI home loan EMI instantly. SBI rates from 7.50%, NRI rates from 7.75%. Includes SBI MaxGain calculator, amortization schedule & prepayment analysis.",
    intro: "State Bank of India is India's largest home loan lender by volume, trusted by millions for its low starting rates and government-backed security. SBI's flagship MaxGain product is unique in the market — it functions like an overdraft account linked to your home loan, allowing you to park surplus funds and reduce your effective interest cost without triggering prepayment. For government employees, defence personnel, and high-CIBIL borrowers, SBI consistently offers the most competitive rates among all major banks."
  },
  {
    slug: "hdfc-home-loan-calculator",
    bankName: "HDFC Bank",
    defaultRate: 8.50,
    regularRateText: "7.20% – 13.20%*",
    nriRateText: "~7.90% onwards*",
    usp: "Fastest loan processing among large private banks with doorstep service and strong digital experience",
    processingFee: "0.5% + GST or min ₹3,000",
    maxTenure: "30 years",
    minCibil: "700",
    metaTitle: "HDFC Home Loan EMI Calculator 2026 — Rates, NRI Rates & Processing | gpaisa.in",
    metaDescription: "Calculate HDFC home loan EMI instantly. HDFC rates from 7.20%, NRI rates from 7.90%. Amortization schedule, prepayment calculator & HDFC-specific loan details.",
    intro: "HDFC Bank is India's largest private sector home loan lender, known for fast processing, premium customer service, and a seamless digital application experience. While HDFC's rates are marginally higher than the top PSU banks, the trade-off is significantly faster approval — typically 3–5 working days versus 2–3 weeks at government banks. HDFC also offers a 0.05% interest concession for women borrowers and has a specialised product called HDFC Reach for customers with informal or irregular income documentation."
  },
  {
    slug: "icici-home-loan-calculator",
    bankName: "ICICI Bank",
    defaultRate: 8.25,
    regularRateText: "7.65% – 9.80%*",
    nriRateText: "~8.95% onwards*",
    usp: "Instant digital sanction letter and Step-Up EMI option — lower EMI in early years rising gradually as income grows",
    processingFee: "0.5% + GST (min ₹3,000)",
    maxTenure: "30 years",
    minCibil: "700",
    metaTitle: "ICICI Home Loan EMI Calculator 2026 — Rates, NRI Rates & Step-Up EMI | gpaisa.in",
    metaDescription: "Calculate ICICI Bank home loan EMI instantly. Rates from 7.65%, NRI rates from 8.95%. Includes Step-Up EMI calculator, amortization schedule & prepayment analysis.",
    intro: "ICICI Bank offers one of the most digitally advanced home loan experiences in India, with instant online sanction letters and end-to-end paperless processing. Its Step-Up EMI facility is particularly suited for young salaried professionals — EMIs start lower in the first few years and increase annually as your income grows, making larger loans accessible earlier in your career. ICICI also offers balance transfers from other banks at competitive rates for borrowers looking to reduce their interest cost."
  },
  {
    slug: "axis-home-loan-calculator",
    bankName: "Axis Bank",
    defaultRate: 8.75,
    regularRateText: "8.35% – 11.90%*",
    nriRateText: "~8.25% onwards*",
    usp: "Shubh Aarambh — 3 EMI waiver at loan start, plus strong balance transfer offers and doorstep service",
    processingFee: "1% + GST (min ₹10,000)",
    maxTenure: "30 years",
    minCibil: "700",
    metaTitle: "Axis Bank Home Loan EMI Calculator 2026 — Rates, NRI Rates & EMI Holiday | gpaisa.in",
    metaDescription: "Calculate Axis Bank home loan EMI instantly. Rates 8.00%–11.90%, NRI from 8.25%. Shubh Aarambh EMI holiday, balance transfer calculator & amortization schedule.",
    intro: "Axis Bank's home loan portfolio stands out for its Shubh Aarambh scheme — which waives your first three EMIs, effectively giving you a 3-month payment holiday at the start of your loan. This is useful for buyers who have just made a large down payment and need breathing room in the first quarter. Axis also offers competitive balance transfer rates for borrowers looking to switch from higher-rate lenders. Note that Axis's processing fee of 1% is among the higher ones in the market — factor this into your total cost of borrowing."
  },
  {
    slug: "kotak-home-loan-calculator",
    bankName: "Kotak Mahindra Bank",
    defaultRate: 8.50,
    regularRateText: "7.70% – 9.40%*",
    nriRateText: "~8.85% onwards*",
    usp: "Customised loan structuring for salaried professionals with higher eligibility and loans up to ₹10 crore",
    processingFee: "0.5% + GST",
    maxTenure: "20 years",
    minCibil: "720",
    metaTitle: "Kotak Mahindra Home Loan EMI Calculator 2026 — Rates, NRI & High-Value Loans | gpaisa.in",
    metaDescription: "Calculate Kotak Mahindra home loan EMI. Rates from 7.70%, NRI from 8.85%. High-value loans up to ₹10 crore, amortization schedule & prepayment analysis.",
    intro: "Kotak Mahindra Bank specialises in home loans for salaried professionals and high-net-worth individuals, offering loan amounts up to ₹10 crore — among the highest limits in the private banking sector. Kotak's relationship management approach means borrowers often get customised rate negotiations based on their overall banking relationship. Two things to note: Kotak's maximum tenure is 20 years (shorter than the 30-year maximum at most other banks, which means higher EMIs for the same loan amount) and the minimum CIBIL score requirement of 720 is higher than most competitors."
  },
  {
    slug: "pnb-home-loan-calculator",
    bankName: "Punjab National Bank (PNB)",
    defaultRate: 8.25,
    regularRateText: "7.30% – 9.30%*",
    nriRateText: "~7.80% onwards*",
    usp: "Lowest processing fees among large banks and preferential rates for government, defence, and PSU employees",
    processingFee: "0.35% (max ₹15,000)",
    maxTenure: "30 years",
    minCibil: "650",
    metaTitle: "PNB Home Loan EMI Calculator 2026 — Rates, NRI Rates & Govt Employee Offers | gpaisa.in",
    metaDescription: "Calculate PNB home loan EMI instantly. Rates 7.30%–9.30%, NRI from 7.80%. Best rates for govt employees, low processing fee & amortization schedule.",
    intro: "Punjab National Bank is one of India's largest public sector banks and a strong choice for government employees, defence personnel, and PSU workers who qualify for PNB Pride — a specialised scheme offering below-market rates exclusively for this segment. PNB's processing fee of 0.35% with a maximum of ₹15,000 is one of the lowest among large banks, making it cost-effective for high-value home loans. The trade-off is processing time — PNB typically takes longer than private banks, and the digital application experience is less polished."
  },
  {
    slug: "bank-of-baroda-home-loan-calculator",
    bankName: "Bank of Baroda",
    defaultRate: 8.10,
    regularRateText: "7.20% – 9.00%*",
    nriRateText: "~7.75% onwards*",
    usp: "Digital pre-approved home loans valid for months — apply online and get a sanction letter before you find your property",
    processingFee: "0.25%–0.50% (max ₹20,000)",
    maxTenure: "30 years",
    minCibil: "650",
    metaTitle: "Bank of Baroda Home Loan EMI Calculator 2026 — Rates, NRI & Pre-Approved Loans | gpaisa.in",
    metaDescription: "Calculate Bank of Baroda home loan EMI. Rates 7.20%–9.00%, NRI from 7.75%. Pre-approved digital loans, low processing fee & amortization schedule.",
    intro: "Bank of Baroda offers the lowest starting rate among the featured banks in this comparison — making it worth checking first if you have a strong credit profile and can qualify for their best rate tier. BOB's digital pre-approved home loan facility is a genuine differentiator: you can get a sanction letter online before you have even identified a property, which strengthens your negotiating position with developers and sellers. BOB also has a relatively low processing fee of 0.25%–0.50% with a ₹20,000 cap."
  },
  {
    slug: "canara-bank-home-loan-calculator",
    bankName: "Canara Bank",
    defaultRate: 8.45,
    regularRateText: "7.15% – 10.00%*",
    nriRateText: "~7.65% onwards*",
    usp: "Among the lowest starting rates in the market with long tenure options up to 30 years",
    processingFee: "0.50% (min ₹1,500, max ₹10,000)",
    maxTenure: "30 years",
    minCibil: "650",
    metaTitle: "Canara Bank Home Loan EMI Calculator 2026 — Rates, NRI Rates & Long Tenure | gpaisa.in",
    metaDescription: "Calculate Canara Bank home loan EMI. Rates 7.15%–10.00%, NRI from 7.65%. Long tenure up to 30 years, low starting rate & amortization schedule.",
    intro: "Canara Bank's starting rate of 7.15% is among the lowest available from any large bank in India, making it particularly attractive for borrowers who can qualify for their prime rate tier. Canara's Budget Home Loan product targets the affordable housing segment with simplified documentation for smaller loan amounts. As a major public sector bank, Canara carries government backing and a widespread branch network — particularly useful for borrowers in Tier-2 and Tier-3 cities where private bank branches may be limited."
  },
  {
    slug: "union-bank-home-loan-calculator",
    bankName: "Union Bank of India",
    defaultRate: 8.35,
    regularRateText: "7.15% onwards*",
    nriRateText: "~7.70% onwards*",
    usp: "Attractive rates for government employees and Union Awas scheme specifically designed for NRI home loan borrowers",
    processingFee: "0.50% (max ₹15,000)",
    maxTenure: "30 years",
    minCibil: "675",
    metaTitle: "Union Bank Home Loan EMI Calculator 2026 — Rates, NRI Awas Scheme | gpaisa.in",
    metaDescription: "Calculate Union Bank home loan EMI. Rates from 7.15%, NRI from 7.70%. Union Awas NRI scheme, government employee rates & amortization schedule.",
    intro: "Union Bank of India offers one of the lowest starting rates in the entire home loan market at 7.15% — tied with Canara Bank for the most competitive floor rate among large banks. Union Bank's Awas scheme is specifically designed for NRI borrowers, offering competitive rates and streamlined documentation for Indians residing abroad who want to purchase property in India. For government employees, Union Bank offers preferential rate tiers that can bring the effective rate below 7.5% for qualifying applicants."
  },
  {
    slug: "idbi-home-loan-calculator",
    bankName: "IDBI Bank",
    defaultRate: 8.45,
    regularRateText: "7.35% – 10.05%*",
    nriRateText: "~7.95% onwards*",
    usp: "Flexible eligibility norms for self-employed and business owners with IDBI Neev joint loan facility",
    processingFee: "0.50% (min ₹2,500)",
    maxTenure: "30 years",
    minCibil: "700",
    metaTitle: "IDBI Bank Home Loan EMI Calculator 2026 — Rates, NRI Rates & Self-Employed | gpaisa.in",
    metaDescription: "Calculate IDBI Bank home loan EMI. Rates 7.35%–10.05%, NRI from 7.95%. Flexible self-employed norms, IDBI Neev joint loans & amortization schedule.",
    intro: "IDBI Bank has undergone significant transformation in recent years and now offers home loans with flexible eligibility norms — particularly useful for self-employed individuals and business owners who may have irregular income documentation. IDBI's Neev joint home loan product enhances eligibility by allowing multiple co-applicants to combine their income, which is helpful for families where both spouses work and want to maximise their loan eligibility. Note that IDBI's maximum rate of 10.05% is on the higher end for this segment — your actual rate will depend heavily on your credit profile."
  },
  {
    slug: "yes-bank-home-loan-calculator",
    bankName: "Yes Bank",
    defaultRate: 9.40,
    regularRateText: "~8.50% onwards*",
    nriRateText: "~8.75% onwards*",
    usp: "Fastest digital onboarding and approval turnaround among mid-size private banks",
    processingFee: "1% + GST",
    maxTenure: "35 years",
    minCibil: "700",
    metaTitle: "Yes Bank Home Loan EMI Calculator 2026 — Rates, 35-Year Tenure & NRI Rates | gpaisa.in",
    metaDescription: "Calculate Yes Bank home loan EMI. Rates from 8.50%, NRI from 8.75%. Unique 35-year tenure for lowest EMI, fast digital approval & amortization schedule.",
    intro: "Yes Bank offers the longest home loan tenure in this comparison at 35 years — which gives borrowers the lowest possible monthly EMI for any given loan amount. A ₹50 lakh loan at 9.40% for 35 years has an EMI of approximately ₹43,750, compared to ₹45,440 for the same loan at 30 years — a ₹1,690 monthly saving. Yes Bank has significantly stabilised since its 2020 restructuring and now offers fast digital onboarding. Its starting rate of 8.50% is higher than PSU banks but competitive for mid-size private lenders."
  },
  {
    slug: "indusind-home-loan-calculator",
    bankName: "IndusInd Bank",
    defaultRate: 8.75,
    regularRateText: "~8.60% onwards*",
    nriRateText: "~8.85% onwards*",
    usp: "Personalised relationship management with dedicated loan officer and fast-track approval for salaried professionals",
    processingFee: "0.5% + GST",
    maxTenure: "30 years",
    minCibil: "720",
    metaTitle: "IndusInd Bank Home Loan EMI Calculator 2026 — Rates, NRI Rates & Fast Approval | gpaisa.in",
    metaDescription: "Calculate IndusInd Bank home loan EMI. Rates from 8.60%, NRI from 8.85%. Personalised service, fast approval for salaried professionals & amortization schedule.",
    intro: "IndusInd Bank differentiates itself through personalised relationship management — each borrower is assigned a dedicated relationship manager throughout the loan process, which reduces back-and-forth and speeds up documentation. For salaried professionals with a CIBIL score above 750, IndusInd can process approvals within 48 hours. The minimum CIBIL requirement of 720 is higher than most banks, so self-employed borrowers or those with thinner credit histories may find eligibility harder here than at PSU banks."
  },
  {
    slug: "idfc-first-home-loan-calculator",
    bankName: "IDFC FIRST Bank",
    defaultRate: 8.85,
    regularRateText: "8.85% onwards*",
    nriRateText: "~9.10% onwards*",
    usp: "Fully digital end-to-end process with flexible repayment structures and high-value loan offerings",
    processingFee: "0.25%–1.5% + GST",
    maxTenure: "30 years",
    minCibil: "700",
    metaTitle: "IDFC FIRST Bank Home Loan EMI Calculator 2026 — Rates, NRI Rates & Digital Process | gpaisa.in",
    metaDescription: "Calculate IDFC FIRST Bank home loan EMI. Rates from 8.85%, NRI from 9.10%. Fully digital process, flexible repayment & amortization schedule.",
    intro: "IDFC FIRST Bank has built its home loan product around a fully digital customer experience — from application to disbursement, the entire process is designed to be paperless and fast. IDFC FIRST offers flexible repayment structures including step-up and step-down EMI options, and caters well to high-value property purchases in metro cities. The processing fee structure of 0.25%–1.5% is variable and depends on loan amount and borrower profile — confirm your specific fee before applying as it can vary significantly."
  },
  {
    slug: "bandhan-bank-home-loan-calculator",
    bankName: "Bandhan Bank",
    defaultRate: 9.15,
    regularRateText: "~8.75% onwards*",
    nriRateText: "~9.00% onwards*",
    usp: "Strong reach in semi-urban and emerging markets across East and Northeast India",
    processingFee: "0.25%–1% + GST",
    maxTenure: "25 years",
    minCibil: "700",
    metaTitle: "Bandhan Bank Home Loan EMI Calculator 2026 — Rates, NRI Rates & Semi-Urban Reach | gpaisa.in",
    metaDescription: "Calculate Bandhan Bank home loan EMI. Rates from 8.75%, NRI from 9.00%. Strong semi-urban and East India reach, amortization schedule & prepayment analysis.",
    intro: "Bandhan Bank is particularly relevant for home buyers in smaller cities, semi-urban areas, and the eastern states of India — West Bengal, Assam, Odisha, Bihar — where Bandhan has a dense branch network that larger private banks often lack. For buyers in these regions, Bandhan can offer faster local processing and better access to in-person support than a national private bank. Note that Bandhan's maximum tenure of 25 years is shorter than the 30-year maximum at most other banks, which means marginally higher EMIs for the same loan amount."
  },
  {
    slug: "rbl-home-loan-calculator",
    bankName: "RBL Bank",
    defaultRate: 9.25,
    regularRateText: "~9.00% onwards*",
    nriRateText: "~9.25% onwards*",
    usp: "Quick processing and flexible documentation for niche borrower profiles including self-employed and non-salaried",
    processingFee: "1% + GST",
    maxTenure: "25 years",
    minCibil: "700",
    metaTitle: "RBL Bank Home Loan EMI Calculator 2026 — Rates, NRI Rates & Self-Employed | gpaisa.in",
    metaDescription: "Calculate RBL Bank home loan EMI. Rates from 9.00%, NRI from 9.25%. Self-employed friendly, quick processing for niche profiles & amortization schedule.",
    intro: "RBL Bank serves niche borrower profiles that larger banks sometimes decline — self-employed individuals, business owners with irregular income, and borrowers in non-standard employment categories. If you have been declined by SBI, HDFC, or ICICI primarily due to income documentation issues rather than credit score, RBL's flexible documentation norms may be worth exploring. Keep in mind that RBL's starting rate of 9.00% and processing fee of 1% make it among the more expensive options here — the flexibility comes at a cost premium."
  }
];

// Lookup by full slug (e.g., "sbi-home-loan-calculator")
export function getBankHomeLoanDataBySlug(slug: string): BankHomeLoanData | undefined {
  return bankHomeLoanData.find(b => b.slug === slug);
}
