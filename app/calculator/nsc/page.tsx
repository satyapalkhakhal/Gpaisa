import { Metadata } from 'next';
import NSCCalculatorClient from '@/components/NSCCalculatorClient';
import NSCContent from '@/components/nsc/NSCContent';
import { computeNSCDefaults, NSC_RATE, NSC_TENURE_YEARS } from '@/lib/smallSavingsCalculations';

export const metadata: Metadata = {
  title: 'NSC Calculator 2026 — National Savings Certificate Maturity Value | gpaisa.in',
  description: `Free NSC Calculator for FY 2026-27. Calculate National Savings Certificate maturity value at ${NSC_RATE}% p.a. compounded annually over ${NSC_TENURE_YEARS} years. Section 80C eligible.`,
  authors: [{ name: 'Satyapal Khakhal' }],
  openGraph: {
    title: 'NSC Calculator 2026 — National Savings Certificate | gpaisa.in',
    description: `Calculate NSC maturity value at ${NSC_RATE}% p.a. instantly.`,
    type: 'website',
    url: 'https://www.gpaisa.in/calculator/nsc',
    siteName: 'gpaisa.in',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NSC Calculator 2026 | gpaisa.in',
    description: `Calculate your National Savings Certificate maturity value at ${NSC_RATE}% p.a.`,
    creator: '@gpaisa_in',
  },
  alternates: { canonical: 'https://www.gpaisa.in/calculator/nsc' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export default function NSCCalculatorPage() {
  const defaults = computeNSCDefaults();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.gpaisa.in/calculator/nsc#webpage',
        url: 'https://www.gpaisa.in/calculator/nsc',
        name: 'NSC Calculator 2026 — National Savings Certificate Maturity Value',
        description: `Calculate NSC maturity value at ${NSC_RATE}% p.a. over ${NSC_TENURE_YEARS} years.`,
        isPartOf: { '@id': 'https://www.gpaisa.in/#website' },
        author: { '@type': 'Person', name: 'Satyapal Khakhal' },
        breadcrumb: { '@id': 'https://www.gpaisa.in/calculator/nsc#breadcrumb' },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.gpaisa.in/calculator/nsc#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
          { '@type': 'ListItem', position: 2, name: 'Calculator', item: 'https://www.gpaisa.in/calculator' },
          { '@type': 'ListItem', position: 3, name: 'NSC Calculator', item: 'https://www.gpaisa.in/calculator/nsc' },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'NSC Calculator India 2026',
        url: 'https://www.gpaisa.in/calculator/nsc',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        description: `Calculate National Savings Certificate maturity value at ${NSC_RATE}% p.a. compounded annually over ${NSC_TENURE_YEARS} years.`,
        featureList: ['5-year compounded maturity calculation', 'SSR default results'],
      },
      {
        '@type': 'HowTo',
        name: 'How to Use NSC Calculator',
        description: 'Step-by-step guide to calculate your NSC maturity value',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Enter Investment Amount', text: 'Enter the lump sum amount you want to invest in NSC.' },
          { '@type': 'HowToStep', position: 2, name: 'View Maturity Value', text: `The calculator shows your maturity value after ${NSC_TENURE_YEARS} years, compounded annually at ${NSC_RATE}%.` },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.gpaisa.in/calculator/nsc#faq',
        mainEntity: [
          { '@type': 'Question', name: 'What is the current NSC interest rate?', acceptedAnswer: { '@type': 'Answer', text: 'For the April–June 2026 quarter it is 7.7% p.a., compounded annually. The rate applicable when you buy the certificate is locked in for its full 5-year tenure.' } },
          { '@type': 'Question', name: 'Can I withdraw NSC before maturity?', acceptedAnswer: { '@type': 'Answer', text: 'No, premature withdrawal is generally not allowed except in specific cases like death of the holder or a court order.' } },
          { '@type': 'Question', name: 'Is NSC interest taxable?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, interest is added to taxable income each year, though the reinvested portion (except the final year) qualifies for Section 80C.' } },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NSCCalculatorClient initialPrincipal={defaults.principal} initialResult={defaults.result} />
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <NSCContent />
      </div>
    </>
  );
}
