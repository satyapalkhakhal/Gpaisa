import { Metadata } from 'next';
import SimpleInterestCalculatorClient from '@/components/SimpleInterestCalculatorClient';
import SIContent from '@/components/si/SIContent';

// ─── SSR defaults: Principal ₹1,00,000 | Rate 8% | Time 3 years ──────────────
function computeSIDefaults() {
  const p = 100000, r = 8, t = 3;
  const si = (p * r * t) / 100;   // 24,000
  return { initialSI: si, initialTotal: p + si };  // 1,24,000
}

export const metadata: Metadata = {
  title: 'Simple Interest Calculator 2026 — Formula, Examples, Reverse Calculator | gpaisa.in',
  description: 'Free Simple Interest Calculator India (2026). Formula SI=(P×R×T)/100 with 3 worked examples, reverse calculator to find P/R/T, SI vs CI comparison table, and interest rate reference chart.',
  authors: [{ name: 'Satyapal Khakhal' }],
  openGraph: {
    title: 'Simple Interest Calculator 2026 — SI Formula, Examples & Reverse Calculator | gpaisa.in',
    description: 'Calculate simple interest instantly. SI = (P×R×T)/100 with worked examples, reverse calculator (find P, R or T), SI vs CI comparison, and reference rate table.',
    type: 'article',
    url: 'https://www.gpaisa.in/calculator/simple-interest',
    siteName: 'gpaisa.in',
    images: [{ url: '/og-simple-interest-calculator.jpg', width: 1200, height: 630, alt: 'Simple Interest Calculator 2026 — SI Formula & Reverse Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simple Interest Calculator 2026 — SI Formula, Examples & Reverse Calculator | gpaisa.in',
    description: 'Calculate simple interest instantly. SI = (P×R×T)/100 with worked examples, reverse calculator (find P, R or T), SI vs CI comparison, and reference rate table. Free online tool.',
    creator: '@gpaisa_in',
    images: ['/og-simple-interest-calculator.jpg'],
  },
  alternates: { canonical: 'https://www.gpaisa.in/calculator/simple-interest' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export default function SimpleInterestCalculatorPage() {
  const defaults = computeSIDefaults();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.gpaisa.in/calculator/simple-interest#webpage',
        url: 'https://www.gpaisa.in/calculator/simple-interest',
        name: 'Simple Interest Calculator 2026 — Formula, Examples, Reverse Calculator | gpaisa.in',
        description: 'Free SI calculator with reverse calculator (find P, R or T), SI vs CI comparison, and interest rate reference table.',
        author: { '@type': 'Person', name: 'Satyapal Khakhal' },
        breadcrumb: { '@id': 'https://www.gpaisa.in/calculator/simple-interest#breadcrumb' },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.gpaisa.in/calculator/simple-interest#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
          { '@type': 'ListItem', position: 2, name: 'Calculator', item: 'https://www.gpaisa.in/calculator' },
          { '@type': 'ListItem', position: 3, name: 'Simple Interest Calculator', item: 'https://www.gpaisa.in/calculator/simple-interest' },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Simple Interest Calculator India 2026',
        url: 'https://www.gpaisa.in/calculator/simple-interest',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        description: 'Calculate simple interest using SI = (P×R×T)/100. Includes reverse calculator to find principal, rate, or time, plus SI vs CI comparison and year-wise breakdown.',
        featureList: ['SSR default results (₹24,000 interest, ₹1,24,000 total)', 'Reverse calculator tabs (Find P, R, T)', 'Year-wise interest breakdown table', 'SI vs CI comparison toggle', 'Interest rate reference table'],
      },
      {
        '@type': 'HowTo',
        name: 'How to Use Simple Interest Calculator',
        description: 'Step-by-step guide to calculate simple interest',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Enter Principal Amount', text: 'Enter the principal amount (P) you are investing or borrowing.' },
          { '@type': 'HowToStep', position: 2, name: 'Enter Interest Rate', text: 'Enter the annual interest rate (R) as a percentage.' },
          { '@type': 'HowToStep', position: 3, name: 'Enter Time Period', text: 'Enter the time period (T) in years.' },
          { '@type': 'HowToStep', position: 4, name: 'View Interest & Total', text: 'The calculator instantly shows the simple interest earned and the total amount using SI = (P×R×T)/100.' },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.gpaisa.in/calculator/simple-interest#faq',
        mainEntity: [
          { '@type': 'Question', name: 'What is the simple interest formula in maths?', acceptedAnswer: { '@type': 'Answer', text: 'SI = (P × R × T) / 100, where P is the principal, R is the annual interest rate in %, and T is time in years. Total amount: A = P + SI. Example: ₹1,00,000 at 8% for 3 years → SI = ₹24,000, total = ₹1,24,000.' } },
          { '@type': 'Question', name: 'What is the difference between simple and compound interest?', acceptedAnswer: { '@type': 'Answer', text: 'Simple interest is calculated only on the original principal — same every year. Compound interest is calculated on principal plus accumulated interest — grows faster over time. For ₹1 lakh at 8% for 3 years: SI gives ₹24,000 while CI gives ₹25,971 — a difference of ₹1,971.' } },
          { '@type': 'Question', name: 'How do I find the principal if I know the simple interest?', acceptedAnswer: { '@type': 'Answer', text: 'Use: P = (SI × 100) / (R × T). Example: SI = ₹24,000, rate = 8%, time = 3 years → P = (24,000 × 100) / (8 × 3) = ₹1,00,000.' } },
          { '@type': 'Question', name: 'Is EMI calculated on simple interest or compound interest?', acceptedAnswer: { '@type': 'Answer', text: 'Most bank EMI loans use a reducing balance method — a form of compound interest. As you pay EMIs, outstanding principal reduces, so the interest component of each EMI decreases over time.' } },
          { '@type': 'Question', name: 'What is the simple interest on ₹10,000 at 10% for 2 years?', acceptedAnswer: { '@type': 'Answer', text: 'SI = (10,000 × 10 × 2) / 100 = ₹2,000. Total amount = ₹10,000 + ₹2,000 = ₹12,000.' } },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleInterestCalculatorClient {...defaults} />
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <SIContent />
      </div>
    </>
  );
}
