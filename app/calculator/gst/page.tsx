import { Metadata } from 'next';
import GSTCalculatorClient from '@/components/GSTCalculatorClient';
import GSTContent from '@/components/gst/GSTContent';

// ─── Server-side GST computation for default inputs ───────────────────────────
// Defaults: ₹10,000 amount | 18% GST rate | "Add GST" (exclusive) mode
function computeGSTDefaults() {
  const amount = 10000;
  const gstRate = 18;
  const gst = (amount * gstRate) / 100;
  const cgst = gst / 2;
  const sgst = gst / 2;
  return {
    preGstAmount: amount,      // ₹10,000
    cgst,                      // ₹900
    sgst,                      // ₹900
    totalGst: gst,             // ₹1,800
    postGstAmount: amount + gst, // ₹11,800
  };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'GST Calculator India 2026 — Add/Remove GST, CGST SGST IGST Breakdown | gpaisa.in',
  description: "India's most complete GST calculator. Add or remove GST instantly. Get CGST, SGST, IGST breakdown for all slabs — 5%, 18%, 40%. With rate guide, worked examples, and FAQ. Updated 2026.",
  authors: [{ name: 'Satyapal Khakhal' }],
  openGraph: {
    title: 'GST Calculator India 2026 — Add/Remove GST, CGST SGST IGST Breakdown | gpaisa.in',
    description: "India's most complete GST calculator. Add or remove GST instantly. Get CGST, SGST, IGST breakdown for all slabs — 5%, 18%, 40%.",
    type: 'website',
    url: 'https://www.gpaisa.in/calculator/gst',
    siteName: 'gpaisa.in',
    images: [
      {
        url: '/og-gst-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'GST Calculator India 2026 — CGST SGST IGST Breakdown | gpaisa.in',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GST Calculator India 2026 — Add/Remove GST, CGST SGST IGST | gpaisa.in',
    description: "India's most complete GST calculator. CGST, SGST, IGST breakdown for all slabs — 5%, 18%, 40%. Updated 2026.",
    creator: '@gpaisa_in',
    images: ['/og-gst-calculator.jpg'],
  },
  alternates: {
    canonical: 'https://www.gpaisa.in/calculator/gst',
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GSTCalculatorPage() {
  const defaults = computeGSTDefaults();

  // Combined JSON-LD graph
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // ── WebPage
      {
        '@type': 'WebPage',
        '@id': 'https://www.gpaisa.in/calculator/gst#webpage',
        url: 'https://www.gpaisa.in/calculator/gst',
        name: 'GST Calculator India 2026 — Add/Remove GST, CGST SGST IGST Breakdown | gpaisa.in',
        description: "India's most complete GST calculator. Add or remove GST instantly. Get CGST, SGST, IGST breakdown for all slabs — 5%, 18%, 40%.",
        isPartOf: { '@id': 'https://www.gpaisa.in/#website' },
        author: { '@type': 'Person', name: 'Satyapal Khakhal' },
        breadcrumb: { '@id': 'https://www.gpaisa.in/calculator/gst#breadcrumb' },
        inLanguage: 'en-IN',
      },

      // ── BreadcrumbList
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.gpaisa.in/calculator/gst#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
          { '@type': 'ListItem', position: 2, name: 'Calculator', item: 'https://www.gpaisa.in/calculator' },
          { '@type': 'ListItem', position: 3, name: 'GST Calculator', item: 'https://www.gpaisa.in/calculator/gst' },
        ],
      },

      // ── SoftwareApplication
      {
        '@type': 'SoftwareApplication',
        name: 'GST Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        description: 'Free online GST calculator India 2026. Add or remove GST instantly with CGST, SGST, IGST breakdown for all slabs — 5%, 18%, 40%.',
        featureList: [
          'Add GST (exclusive) calculation',
          'Remove GST (inclusive) calculation',
          'CGST and SGST breakdown',
          'IGST for interstate transactions',
          'All GST rate slabs: 0%, 5%, 18%, 40%',
          'Server-side rendered default results',
        ],
      },

      // ── HowTo
      {
        '@type': 'HowTo',
        name: 'How to Use GST Calculator',
        description: 'Step-by-step guide to add or remove GST from an amount',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Choose Add or Remove GST', text: 'Select "Add GST" to calculate GST on a base amount, or "Remove GST" to extract the base price from a GST-inclusive amount.' },
          { '@type': 'HowToStep', position: 2, name: 'Enter Amount', text: 'Enter the amount before or after GST, depending on the mode selected.' },
          { '@type': 'HowToStep', position: 3, name: 'Select GST Rate', text: 'Choose the applicable GST rate — 5%, 18%, or 40% under GST 2.0.' },
          { '@type': 'HowToStep', position: 4, name: 'View CGST/SGST Breakdown', text: 'The calculator instantly shows the CGST, SGST, total GST, and final amount.' },
        ],
      },

      // ── FAQPage
      {
        '@type': 'FAQPage',
        '@id': 'https://www.gpaisa.in/calculator/gst#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the GST rate on services in India?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most services in India fall under the 18% GST slab. Notable exceptions include healthcare and education (0%), food delivery apps (5%), and financial services (18%). Always check the latest CBIC notifications for specific service categories.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I calculate GST on an inclusive amount?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Divide the total amount by (1 + rate/100). Example: ₹11,800 ÷ 1.18 = ₹10,000 base price. The GST component is ₹11,800 − ₹10,000 = ₹1,800. Use the Remove GST mode in the calculator.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between CGST and IGST?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'CGST (Central GST) + SGST (State GST) apply to intrastate transactions and are split equally. IGST (Integrated GST) applies to interstate transactions at the full rate and goes entirely to the central government before being distributed.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is GST applicable on exports?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Exports are zero-rated under GST. This means no GST is charged on exported goods or services. Exporters can claim refund of input tax credit (ITC) paid on inputs used in export production.',
            },
          },
          {
            '@type': 'Question',
            name: 'What items are exempt from GST?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Fresh fruits and vegetables, milk, eggs, bread, books, newspapers, and most agricultural produce are exempt (0% GST). Petroleum products, alcohol for human consumption, and electricity are currently outside the GST framework.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Calculator — pre-initialised with server-computed defaults */}
      <GSTCalculatorClient
        initialPreGstAmount={defaults.preGstAmount}
        initialCgst={defaults.cgst}
        initialSgst={defaults.sgst}
        initialTotalGst={defaults.totalGst}
        initialPostGstAmount={defaults.postGstAmount}
      />

      {/* Static educational content — server-rendered, visible without JS */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <GSTContent />
      </div>
    </>
  );
}
