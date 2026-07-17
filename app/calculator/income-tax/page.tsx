import { Metadata } from 'next';
import IncomeTaxCalculatorClient from '@/components/IncomeTaxCalculatorClient';
import IncomeTaxContent from '@/components/income-tax/IncomeTaxContent';
import { computeIncomeTaxDefaults } from '@/lib/incomeTaxCalculations';

export const metadata: Metadata = {
  title: 'Income Tax Calculator 2026 — Old vs New Regime Comparison | gpaisa.in',
  description: "Free Income Tax Calculator for FY 2026-27 (AY 2027-28). Compare old vs new tax regime, calculate tax liability with 87A rebate, surcharge, and cess. Age-based slabs for senior citizens included.",
  authors: [{ name: 'Satyapal Khakhal' }],
  openGraph: {
    title: 'Income Tax Calculator 2026 — Old vs New Regime Comparison | gpaisa.in',
    description: 'Compare old vs new tax regime instantly. Free income tax calculator for FY 2026-27 with 87A rebate, surcharge, and cess breakdown.',
    type: 'website',
    url: 'https://www.gpaisa.in/calculator/income-tax',
    siteName: 'gpaisa.in',
    images: [
      {
        url: '/og-income-tax-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'Income Tax Calculator 2026 — Old vs New Regime | gpaisa.in',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Income Tax Calculator 2026 — Old vs New Regime | gpaisa.in',
    description: 'Compare old vs new tax regime instantly. Free income tax calculator for FY 2026-27 with 87A rebate, surcharge, and cess breakdown.',
    creator: '@gpaisa_in',
    images: ['/og-income-tax-calculator.jpg'],
  },
  alternates: {
    canonical: 'https://www.gpaisa.in/calculator/income-tax',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function IncomeTaxCalculatorPage() {
  const defaults = computeIncomeTaxDefaults();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.gpaisa.in/calculator/income-tax#webpage',
        url: 'https://www.gpaisa.in/calculator/income-tax',
        name: 'Income Tax Calculator 2026 — Old vs New Regime Comparison | gpaisa.in',
        description: 'Free Income Tax Calculator for FY 2026-27. Compare old vs new tax regime with 87A rebate, surcharge, and cess.',
        isPartOf: { '@id': 'https://www.gpaisa.in/#website' },
        author: { '@type': 'Person', name: 'Satyapal Khakhal' },
        breadcrumb: { '@id': 'https://www.gpaisa.in/calculator/income-tax#breadcrumb' },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.gpaisa.in/calculator/income-tax#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
          { '@type': 'ListItem', position: 2, name: 'Calculator', item: 'https://www.gpaisa.in/calculator' },
          { '@type': 'ListItem', position: 3, name: 'Income Tax Calculator', item: 'https://www.gpaisa.in/calculator/income-tax' },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Income Tax Calculator India 2026',
        url: 'https://www.gpaisa.in/calculator/income-tax',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        description: 'Compare old vs new income tax regime for FY 2026-27. Includes 87A rebate, age-based old regime slabs, surcharge, and cess calculation.',
        featureList: [
          'Old vs New regime side-by-side comparison',
          'Age-based exemption limits (below 60 / senior / super senior)',
          'Section 80C, home loan interest, and NPS 80CCD(1B) deductions',
          'Section 87A rebate calculation for both regimes',
          'Surcharge and 4% health & education cess',
          'SSR default results',
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Use Income Tax Calculator',
        description: 'Step-by-step guide to compare old vs new tax regime',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Enter Gross Annual Income', text: 'Enter your total annual income from salary or other sources.' },
          { '@type': 'HowToStep', position: 2, name: 'Select Age Category', text: 'Choose your age category — this affects the old regime exemption limit only.' },
          { '@type': 'HowToStep', position: 3, name: 'Enter Deductions', text: 'If comparing the old regime, enter your Section 80C, home loan interest, NPS, and HRA exemption amounts.' },
          { '@type': 'HowToStep', position: 4, name: 'View Comparison', text: 'The calculator shows tax payable under both regimes side-by-side and recommends the one that saves you more.' },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.gpaisa.in/calculator/income-tax#faq',
        mainEntity: [
          { '@type': 'Question', name: 'Which tax regime should I choose — old or new?', acceptedAnswer: { '@type': 'Answer', text: "It depends on your total deductions. If your 80C, HRA, home loan interest, and other deductions add up to a large amount relative to your income, the old regime may work out cheaper. For most people with modest deductions, the new regime's lower rates and higher rebate threshold (₹12 lakh) result in less tax." } },
          { '@type': 'Question', name: 'Is the new tax regime the default now?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Since FY 2023-24, the new tax regime under Section 115BAC is the default. You must actively opt for the old regime when filing your return if you want to use it.' } },
          { '@type': 'Question', name: 'Can I switch between old and new regime every year?', acceptedAnswer: { '@type': 'Answer', text: 'Salaried individuals with no business income can switch between regimes every financial year. Individuals with business or professional income can switch only once in their lifetime back to the old regime after opting for the new one.' } },
          { '@type': 'Question', name: 'Is HRA exemption available under the new tax regime?', acceptedAnswer: { '@type': 'Answer', text: 'No. HRA exemption, Section 80C, home loan interest, and most other deductions are not available under the new tax regime. The new regime instead offers a standard deduction of ₹75,000 and lower slab rates.' } },
          { '@type': 'Question', name: 'What is the Section 87A rebate?', acceptedAnswer: { '@type': 'Answer', text: 'A rebate that reduces your tax liability to zero if your taxable income is below a threshold — ₹5,00,000 under the old regime (rebate up to ₹12,500) and ₹12,00,000 under the new regime (rebate up to ₹60,000).' } },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <IncomeTaxCalculatorClient
        initialGrossIncome={defaults.grossIncome}
        initialAgeCategory={defaults.ageCategory}
        initialComparison={defaults.comparison}
      />

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <IncomeTaxContent />
      </div>
    </>
  );
}
