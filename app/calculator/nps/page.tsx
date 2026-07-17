import { Metadata } from 'next';
import NPSCalculatorClient from '@/components/NPSCalculatorClient';
import NPSContent from '@/components/nps/NPSContent';

// ─── SSR defaults: ₹5K/mo, 10% return, age 30 → retire 60 (30 yr) ────────────
function computeNPSDefaults() {
  const monthly = 5000;
  const r = 10 / 12 / 100;
  const months = 30 * 12;
  const fv = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const invested = monthly * months;
  const annuity = fv * 0.20;
  const lumpsum = fv * 0.80;
  const monthlyPension = (annuity * 6) / 100 / 12;
  return {
    initialTotalInvestment: Math.round(invested),       // ₹18,00,000
    initialWealthGained: Math.round(fv - invested),     // ₹95,36,XXX
    initialMaturityValue: Math.round(fv),               // ₹1,13,36,XXX
    initialLumpsum: Math.round(lumpsum),                // 80%
    initialAnnuity: Math.round(annuity),                // 20%
    initialMonthlyPension: Math.round(monthlyPension),  // ~₹11,336
  };
}

export const metadata: Metadata = {
  title: 'NPS Calculator 2026 — Retirement Corpus, Monthly Pension & Tax Savings | gpaisa.in',
  description: "India's most complete NPS calculator (2026). Calculate retirement corpus, monthly pension, tax benefits under 80CCD, and year-wise growth. Updated for latest PFRDA 2025 rules — 80% lump sum, ₹5L threshold, age 85 extension.",
  authors: [{ name: 'Satyapal Khakhal' }],
  openGraph: {
    title: 'NPS Calculator 2026 — Retirement Corpus, Monthly Pension & Tax Benefits | gpaisa.in',
    description: "Calculate NPS retirement corpus, monthly pension, and tax savings. Updated for 2025 PFRDA rules — 80% lump sum, ₹5L threshold, age 85 extension.",
    type: 'article',
    url: 'https://www.gpaisa.in/calculator/nps',
    siteName: 'gpaisa.in',
    images: [{ url: '/og-nps-calculator.jpg', width: 1200, height: 630, alt: 'NPS Calculator India 2026 — Retirement Corpus & Monthly Pension' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NPS Calculator 2026 — Retirement Corpus, Monthly Pension & Tax Benefits | gpaisa.in',
    description: 'Calculate NPS retirement corpus, monthly pension, and tax savings. Updated for 2025 PFRDA rules — 80% lump sum, ₹5L threshold, age 85 extension. Free NPS calculator India.',
    creator: '@gpaisa_in',
    images: ['/og-nps-calculator.jpg'],
  },
  alternates: { canonical: 'https://www.gpaisa.in/calculator/nps' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export default function NPSCalculatorPage() {
  const defaults = computeNPSDefaults();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.gpaisa.in/calculator/nps#webpage',
        url: 'https://www.gpaisa.in/calculator/nps',
        name: 'NPS Calculator 2026 — Retirement Corpus, Monthly Pension & Tax Savings | gpaisa.in',
        description: "India's most complete NPS calculator. Calculate retirement corpus, monthly pension, and tax benefits under 80CCD. Updated for PFRDA 2025 rules.",
        isPartOf: { '@id': 'https://www.gpaisa.in/#website' },
        author: { '@type': 'Person', name: 'Satyapal Khakhal' },
        breadcrumb: { '@id': 'https://www.gpaisa.in/calculator/nps#breadcrumb' },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.gpaisa.in/calculator/nps#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
          { '@type': 'ListItem', position: 2, name: 'Calculator', item: 'https://www.gpaisa.in/calculator' },
          { '@type': 'ListItem', position: 3, name: 'NPS Calculator', item: 'https://www.gpaisa.in/calculator/nps' },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'NPS Calculator India 2026',
        url: 'https://www.gpaisa.in/calculator/nps',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        description: 'Calculate NPS retirement corpus, monthly pension, and tax savings under 80CCD. Updated for PFRDA Dec 2025 rules. Includes senior citizen bonus, step-up contributions, and year-wise growth table.',
        featureList: [
          'PFRDA Dec 2025 withdrawal rules (80% lump sum)',
          'Monthly pension estimate via annuity rate',
          'Tax savings under 80CCD(1), 80CCD(1B), 80CCD(2)',
          'Step-up annual contribution option',
          'Employer contribution support',
          'Year-wise corpus growth table',
          'SSR default results',
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Use NPS Calculator',
        description: 'Step-by-step guide to calculate your NPS retirement corpus and pension',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Enter Monthly Contribution', text: 'Enter your own monthly contribution to your NPS Tier 1 account.' },
          { '@type': 'HowToStep', position: 2, name: 'Set Current & Retirement Age', text: 'Enter your current age and the age at which you plan to retire.' },
          { '@type': 'HowToStep', position: 3, name: 'Set Expected Return & Annuity Rate', text: 'Choose your expected annual return and the annuity rate for pension calculation.' },
          { '@type': 'HowToStep', position: 4, name: 'View Corpus & Pension', text: 'The calculator shows your retirement corpus, lump sum, and estimated monthly pension.' },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.gpaisa.in/calculator/nps#faq',
        mainEntity: [
          { '@type': 'Question', name: 'What is the NPS interest rate in India in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'NPS does not have a fixed interest rate — returns are market-linked. Historically, equity-heavy NPS portfolios (Scheme E) have delivered 10–13% CAGR over 10-year periods. Conservative portfolios (Scheme G) typically return 7–9%.' } },
          { '@type': 'Question', name: 'What is the minimum NPS contribution per month?', acceptedAnswer: { '@type': 'Answer', text: 'Minimum contribution for Tier 1 NPS is ₹1,000 per year. If paying monthly, minimum is ₹500/month. No maximum limit, but tax benefits are capped at ₹2 lakh per year under 80CCD(1) + 80CCD(1B).' } },
          { '@type': 'Question', name: 'How much monthly pension will I get from NPS?', acceptedAnswer: { '@type': 'Answer', text: 'Monthly pension = (Annuity Corpus × Annuity Rate) ÷ 12. Example: ₹20 lakh annuity at 6% rate = ₹10,000/month. Use the calculator above to estimate your specific pension.' } },
          { '@type': 'Question', name: 'Can I withdraw NPS before 60 years?', acceptedAnswer: { '@type': 'Answer', text: 'Partial withdrawal of up to 25% of own contributions is allowed after 3 years for specific purposes. For complete exit before 60, minimum 80% of corpus must buy an annuity. If corpus is ₹5 lakh or less (PFRDA Dec 2025), 100% lump sum is allowed.' } },
          { '@type': 'Question', name: 'What happens to NPS corpus after death?', acceptedAnswer: { '@type': 'Answer', text: 'The entire NPS corpus goes to the registered nominee or legal heir as 100% lump sum — no annuity required. Register a nominee when opening your NPS account.' } },
          { '@type': 'Question', name: 'NPS or Mutual Fund SIP — which is better for retirement?', acceptedAnswer: { '@type': 'Answer', text: 'NPS wins on tax efficiency — ₹50,000 extra deduction under 80CCD(1B) and 80% tax-free lump sum are unique. SIPs offer complete flexibility. Use both: NPS for tax benefits and pension structure, SIP for flexible wealth creation.' } },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NPSCalculatorClient {...defaults} />
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <NPSContent />
      </div>
    </>
  );
}
