import { Metadata } from 'next';
import FDCalculatorClient from '@/components/FDCalculatorClient';
import FDContent from '@/components/fd/FDContent';

// ─── SSR: compute defaults (₹1L, 7%, 5yr, quarterly) ─────────────────────────
function computeFDDefaults() {
  const principal = 100000;
  const rate = 7 / 100;
  const n = 4; // quarterly
  const t = 5;
  const maturity = principal * Math.pow(1 + rate / n, n * t);
  return {
    initialPrincipal: principal,
    initialInterest: Math.round(maturity - principal), // 41,478
    initialMaturity: Math.round(maturity),             // 1,41,478
  };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'FD Calculator 2026 — Fixed Deposit Maturity, TDS & Bank Rate Comparison | gpaisa.in',
  description: "India's most complete FD calculator. ₹1 lakh at 7% for 5 years = ₹1,41,478. Calculate maturity with TDS, senior citizen rates, quarterly/monthly compounding. Compare SBI, HDFC, ICICI, Post Office rates. Updated May 2026.",
  authors: [{ name: 'Satyapal Khakhal' }],
  openGraph: {
    title: 'FD Calculator 2026 — Fixed Deposit Maturity & Bank Rate Comparison | gpaisa.in',
    description: "India's most complete FD calculator. Compare SBI, HDFC, ICICI, Post Office FD rates. Calculate maturity with TDS deduction, senior citizen bonus, all compounding options.",
    type: 'website',
    url: 'https://www.gpaisa.in/calculator/fd',
    siteName: 'gpaisa.in',
    images: [{ url: '/og-fd-calculator.jpg', width: 1200, height: 630, alt: 'FD Calculator India 2026 — Fixed Deposit Maturity & Bank Rate Comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "FD Calculator 2026 — ₹1L @ 7% for 5 yrs = ₹1,41,478 | gpaisa.in",
    description: 'Calculate FD maturity with TDS, senior citizen rates, and bank comparison. SBI, HDFC, ICICI, Post Office — all rates updated May 2026.',
    creator: '@gpaisa_in',
    images: ['/og-fd-calculator.jpg'],
  },
  alternates: { canonical: 'https://www.gpaisa.in/calculator/fd' },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FDCalculatorPage() {
  const defaults = computeFDDefaults();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.gpaisa.in/calculator/fd#webpage',
        url: 'https://www.gpaisa.in/calculator/fd',
        name: 'FD Calculator 2026 — Fixed Deposit Maturity, TDS & Bank Rate Comparison | gpaisa.in',
        description: "India's most complete FD calculator. Calculate maturity with TDS, senior citizen rates, and bank rate comparison.",
        isPartOf: { '@id': 'https://www.gpaisa.in/#website' },
        author: { '@type': 'Person', name: 'Satyapal Khakhal' },
        breadcrumb: { '@id': 'https://www.gpaisa.in/calculator/fd#breadcrumb' },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.gpaisa.in/calculator/fd#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
          { '@type': 'ListItem', position: 2, name: 'Calculator', item: 'https://www.gpaisa.in/calculator' },
          { '@type': 'ListItem', position: 3, name: 'FD Calculator', item: 'https://www.gpaisa.in/calculator/fd' },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'FD Calculator India 2026',
        url: 'https://www.gpaisa.in/calculator/fd',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        description: 'Calculate Fixed Deposit maturity amount with TDS, senior citizen rates, and bank comparison. All compounding options — monthly, quarterly, yearly.',
        featureList: ['Senior citizen rate (+0.50%)', 'TDS calculation (10%/20%)', 'Tax-Saving FD (80C) mode', 'All compounding frequencies', 'Bank rate comparison table', 'SSR default results'],
      },
      {
        '@type': 'HowTo',
        name: 'How to Use FD Calculator',
        description: 'Step-by-step guide to calculate your Fixed Deposit maturity amount',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Enter Deposit Amount', text: 'Enter the amount you want to deposit as a Fixed Deposit.' },
          { '@type': 'HowToStep', position: 2, name: 'Enter Interest Rate', text: 'Enter the annual interest rate offered by your bank.' },
          { '@type': 'HowToStep', position: 3, name: 'Set Tenure & Compounding', text: 'Choose the deposit tenure in years and the compounding frequency (monthly/quarterly/yearly).' },
          { '@type': 'HowToStep', position: 4, name: 'View Maturity Amount', text: 'The calculator shows your maturity amount, interest earned, and TDS impact.' },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.gpaisa.in/calculator/fd#faq',
        mainEntity: [
          { '@type': 'Question', name: 'What is the TDS limit on FD interest in 2026?', acceptedAnswer: { '@type': 'Answer', text: '₹40,000/year for regular citizens, ₹50,000 for senior citizens. TDS at 10% with PAN, 20% without. Submit Form 15G or 15H if total income is below the taxable limit to get zero TDS.' } },
          { '@type': 'Question', name: 'Which bank has the highest FD rate in India in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'Yes Bank offers up to 7.75% for select tenures. Among large banks, HDFC and ICICI offer up to 7.25%. Post Office Time Deposit offers 7.50% for 5 years — backed by the Government of India.' } },
          { '@type': 'Question', name: 'Is FD interest taxable in India?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. FD interest is fully taxable as Income from Other Sources at your income slab rate. There is no concessional rate like equity LTCG. You can claim TDS credit and submit Form 15G/15H to avoid TDS deduction at source.' } },
          { '@type': 'Question', name: 'What is the DICGC insurance limit on FDs?', acceptedAnswer: { '@type': 'Answer', text: '₹5 lakh per depositor per bank — covering principal + interest combined. If your FD exceeds ₹5 lakh, consider spreading across multiple banks for full insurance coverage.' } },
          { '@type': 'Question', name: 'Can I break an FD before maturity?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, for regular FDs. Penalty is typically 0.5–1% reduction on the applicable interest rate. Tax-Saving FDs cannot be broken before 5 years.' } },
          { '@type': 'Question', name: 'What is the minimum FD amount?', acceptedAnswer: { '@type': 'Answer', text: '₹1,000 at SBI and most public sector banks. ₹5,000 at HDFC Bank. ₹10,000 at ICICI Bank. ₹1,000 at Post Office.' } },
          { '@type': 'Question', name: 'Is quarterly or monthly compounding better for FD?', acceptedAnswer: { '@type': 'Answer', text: 'Quarterly compounding gives slightly higher returns because interest is reinvested. For ₹1 lakh at 7% for 5 years: quarterly = ₹1,41,478 vs annual = ₹1,40,255 — difference of ₹1,223.' } },
          { '@type': 'Question', name: 'How does a Tax-Saving FD differ from a regular FD?', acceptedAnswer: { '@type': 'Answer', text: 'Tax-Saving FD has a mandatory 5-year lock-in and offers Section 80C deduction up to ₹1.5 lakh. No premature withdrawal, no loan against it, no auto-renewal. Interest is still fully taxable.' } },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FDCalculatorClient
        initialPrincipal={defaults.initialPrincipal}
        initialInterest={defaults.initialInterest}
        initialMaturity={defaults.initialMaturity}
      />
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <FDContent />
      </div>
    </>
  );
}
