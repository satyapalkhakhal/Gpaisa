import { Metadata } from 'next';
import HRACalculatorClient from '@/components/HRACalculatorClient';
import HRAContent from '@/components/hra/HRAContent';

// ─── SSR: compute defaults ────────────────────────────────────────────────────
// Basic ₹50,000 | DA ₹0 | HRA ₹20,000 | Rent ₹15,000 | Metro (50%)
function computeHRADefaults() {
  const basicMonthly = 50000, daMonthly = 0, hraMonthly = 20000, rentMonthly = 15000;
  const annualBasicDA = (basicMonthly + daMonthly) * 12;
  const annualHRA = hraMonthly * 12;                          // 2,40,000
  const c1 = annualHRA;                                       // 2,40,000
  const c2 = Math.max(0, rentMonthly * 12 - 0.1 * annualBasicDA); // 1,20,000
  const c3 = 0.5 * annualBasicDA;                             // 3,00,000
  const exempted = Math.min(c1, c2, c3);                     // 1,20,000
  return { initialAnnualHRA: annualHRA, initialC1: c1, initialC2: c2, initialC3: c3, initialExempted: exempted, initialTaxable: annualHRA - exempted };
}

export const metadata: Metadata = {
  title: 'HRA Calculator 2026 — HRA Exemption, Metro vs Non-Metro & Tax Savings | gpaisa.in',
  description: 'Free HRA calculator India (2026). Calculate House Rent Allowance tax exemption under Section 10(13A). Metro vs non-metro, Form 12BB guide, Section 80GG for self-employed. Instant results.',
  authors: [{ name: 'Satyapal Khakhal' }],
  openGraph: {
    title: 'HRA Calculator 2026 — House Rent Allowance Tax Exemption India | gpaisa.in',
    description: 'Calculate HRA exemption instantly. Three-component formula, metro vs non-metro, old vs new tax regime comparison. Worked example included.',
    type: 'article',
    url: 'https://www.gpaisa.in/calculator/hra',
    siteName: 'gpaisa.in',
    images: [{ url: '/og-hra-calculator.jpg', width: 1200, height: 630, alt: 'HRA Calculator India 2026 — HRA Exemption & Tax Savings' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HRA Calculator 2026 — House Rent Allowance Tax Exemption India | gpaisa.in',
    description: 'Calculate HRA exemption instantly. Three-component formula, metro vs non-metro, old vs new tax regime comparison. Worked example included. Free HRA calculator India 2026.',
    creator: '@gpaisa_in',
    images: ['/og-hra-calculator.jpg'],
  },
  alternates: { canonical: 'https://www.gpaisa.in/calculator/hra' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export default function HRACalculatorPage() {
  const defaults = computeHRADefaults();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.gpaisa.in/calculator/hra#webpage',
        url: 'https://www.gpaisa.in/calculator/hra',
        name: 'HRA Calculator 2026 — HRA Exemption, Metro vs Non-Metro & Tax Savings | gpaisa.in',
        description: 'Free HRA calculator India (2026). Calculate House Rent Allowance tax exemption under Section 10(13A). Metro vs non-metro, Form 12BB, Section 80GG.',
        author: { '@type': 'Person', name: 'Satyapal Khakhal' },
        breadcrumb: { '@id': 'https://www.gpaisa.in/calculator/hra#breadcrumb' },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.gpaisa.in/calculator/hra#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
          { '@type': 'ListItem', position: 2, name: 'Calculator', item: 'https://www.gpaisa.in/calculator' },
          { '@type': 'ListItem', position: 3, name: 'HRA Calculator', item: 'https://www.gpaisa.in/calculator/hra' },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'HRA Calculator India 2026',
        url: 'https://www.gpaisa.in/calculator/hra',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        description: 'Calculate HRA exemption under Section 10(13A). Metro vs non-metro city selector, dual tax slab display, monthly/annual input toggle, Form 12BB guidance.',
        featureList: ['Metro/Non-metro city dropdown with clarification', 'Dual tax slab (20% & 30%) display', 'Monthly/Annual input toggle', 'Three-component breakdown with "least" highlight', 'Section 80GG guidance for self-employed', 'SSR default results'],
      },
      {
        '@type': 'HowTo',
        name: 'How to Use HRA Calculator',
        description: 'Step-by-step guide to calculate your HRA tax exemption',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Select City Type', text: 'Choose whether you live in a metro city (50% of Basic+DA) or non-metro city (40% of Basic+DA).' },
          { '@type': 'HowToStep', position: 2, name: 'Enter Basic Salary & DA', text: 'Enter your Basic Salary and Dearness Allowance.' },
          { '@type': 'HowToStep', position: 3, name: 'Enter HRA Received & Rent Paid', text: 'Enter the HRA component of your salary and the actual rent you pay.' },
          { '@type': 'HowToStep', position: 4, name: 'View Exempted Amount', text: 'The calculator shows your HRA exemption (least of the three components) and taxable HRA.' },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.gpaisa.in/calculator/hra#faq',
        mainEntity: [
          { '@type': 'Question', name: 'What is the HRA exemption limit in India for 2026?', acceptedAnswer: { '@type': 'Answer', text: 'There is no fixed rupee limit — it depends on your salary. The exempt amount is the minimum of: actual HRA received, rent paid minus 10% of Basic+DA, and 50% of Basic+DA for metro cities (40% for non-metro).' } },
          { '@type': 'Question', name: 'Is HRA available under the new tax regime?', acceptedAnswer: { '@type': 'Answer', text: 'No. HRA exemption under Section 10(13A) is only available under the old tax regime. Under the new tax regime, your entire HRA component becomes part of taxable salary.' } },
          { '@type': 'Question', name: 'What is the HRA limit for metro cities vs non-metro cities?', acceptedAnswer: { '@type': 'Answer', text: 'For metro cities (Delhi, Mumbai, Kolkata, Chennai), the HRA cap is 50% of Basic+DA. For non-metro cities including Bengaluru, Hyderabad, Pune, Ahmedabad, the cap is 40% of Basic+DA.' } },
          { '@type': 'Question', name: "Do I need landlord's PAN for HRA claim?", acceptedAnswer: { '@type': 'Answer', text: 'Yes, if your annual rent exceeds ₹1,00,000 (₹8,333+ per month), you must provide your landlord\'s PAN to your employer for HRA exemption in TDS.' } },
          { '@type': 'Question', name: 'Can I claim HRA if I live in my own house?', acceptedAnswer: { '@type': 'Answer', text: 'No. HRA exemption is specifically for employees paying rent. If you own the house you live in, no HRA exemption is applicable — even if HRA is part of your salary package.' } },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HRACalculatorClient {...defaults} />
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <HRAContent />
      </div>
    </>
  );
}
