import { Metadata } from 'next';
import MutualFundCalculatorClient from '@/components/MutualFundCalculatorClient';
import MFContent from '@/components/mf/MFContent';

function computeMFDefaults() {
  const p = 10000, r = 12 / 12 / 100, n = 120;
  const fv = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = p * n;
  return { initialInvested: Math.round(invested), initialReturns: Math.round(fv - invested), initialTotal: Math.round(fv) };
}

export const metadata: Metadata = {
  title: 'Mutual Fund Calculator 2026 — SIP & Lumpsum Returns, Examples & Tax Guide | gpaisa.in',
  description: 'Free Mutual Fund Calculator India (2026). SIP formula FV=P×[((1+r)^n−1)/r]×(1+r) with 4 worked examples, SIP vs lumpsum comparison, fund type presets, year-wise growth table, and tax guide for equity & debt funds.',
  authors: [{ name: 'Satyapal Khakhal' }],
  openGraph: {
    title: 'Mutual Fund Calculator 2026 — SIP & Lumpsum Returns, Examples & Tax Guide | gpaisa.in',
    description: 'Free MF calculator with SIP & lumpsum formulas, 4 worked examples, year-wise growth table, SIP vs lumpsum comparison, fund type presets, and 2026 tax guide.',
    type: 'article',
    url: 'https://www.gpaisa.in/calculator/mutual-fund',
    siteName: 'gpaisa.in',
    images: [{ url: '/og-mutual-fund-calculator.jpg', width: 1200, height: 630, alt: 'Mutual Fund Calculator 2026 — SIP & Lumpsum Returns' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mutual Fund Calculator 2026 — SIP & Lumpsum Returns, Tax & Comparison | gpaisa.in',
    description: 'Calculate SIP & lumpsum returns instantly. Formula, year-wise growth table, SIP vs lumpsum comparison, fund type presets, tax guide. Free MF calculator.',
    creator: '@gpaisa_in',
    images: ['/og-mutual-fund-calculator.jpg'],
  },
  alternates: { canonical: 'https://www.gpaisa.in/calculator/mutual-fund' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export default function MutualFundCalculatorPage() {
  const defaults = computeMFDefaults();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.gpaisa.in/calculator/mutual-fund#webpage',
        url: 'https://www.gpaisa.in/calculator/mutual-fund',
        name: 'Mutual Fund Calculator 2026 — SIP & Lumpsum Returns, Examples & Tax Guide | gpaisa.in',
        description: 'Free MF calculator with SIP & lumpsum formulas, fund type presets, year-wise growth, SIP vs lumpsum comparison, and 2026 tax guide.',
        author: { '@type': 'Person', name: 'Satyapal Khakhal' },
        breadcrumb: { '@id': 'https://www.gpaisa.in/calculator/mutual-fund#breadcrumb' },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.gpaisa.in/calculator/mutual-fund#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
          { '@type': 'ListItem', position: 2, name: 'Calculator', item: 'https://www.gpaisa.in/calculator' },
          { '@type': 'ListItem', position: 3, name: 'Mutual Fund Calculator', item: 'https://www.gpaisa.in/calculator/mutual-fund' },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Mutual Fund Calculator India 2026',
        url: 'https://www.gpaisa.in/calculator/mutual-fund',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        description: 'Calculate SIP and lumpsum mutual fund returns with year-wise growth table, fund type presets, SIP vs lumpsum comparison, and 2026 tax guide.',
        featureList: ['SSR default results (SIP ₹10K → ₹23,23,391 in 10yr)', 'Fund type presets (Debt/Hybrid/Equity/ELSS)', 'Year-wise growth table', 'SIP vs Lumpsum comparison toggle', 'Absolute return % display', 'Tax guide for equity and debt funds 2026'],
      },
      {
        '@type': 'HowTo',
        name: 'How to Use Mutual Fund Calculator',
        description: 'Step-by-step guide to calculate SIP or lumpsum mutual fund returns',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Choose SIP or Lumpsum', text: 'Select SIP for monthly investments or Lumpsum for a one-time investment.' },
          { '@type': 'HowToStep', position: 2, name: 'Enter Investment Amount', text: 'Enter your monthly SIP amount or one-time lumpsum amount.' },
          { '@type': 'HowToStep', position: 3, name: 'Set Expected Return & Duration', text: 'Choose the expected annual return rate (or a fund-type preset) and investment time period.' },
          { '@type': 'HowToStep', position: 4, name: 'View Returns', text: 'The calculator shows your total invested amount, estimated returns, and maturity value with a year-wise growth table.' },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.gpaisa.in/calculator/mutual-fund#faq',
        mainEntity: [
          { '@type': 'Question', name: 'How is SIP return calculated?', acceptedAnswer: { '@type': 'Answer', text: 'SIP return uses: FV = P × [((1 + r)^n − 1) / r] × (1 + r), where P is monthly investment, r is monthly rate (annual ÷ 12 ÷ 100), n is total months. For ₹10,000/mo at 12% for 10 years: invested = ₹12,00,000, total = ₹23,23,391.' } },
          { '@type': 'Question', name: 'Is ₹10,000 SIP enough to become a crorepati?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — at 12% p.a. for about 21 years, a ₹10,000/month SIP grows to ₹1 crore. At 14% p.a. it takes about 19 years. Start early and stay invested through market cycles.' } },
          { '@type': 'Question', name: 'Which mutual fund gives the highest return in India?', acceptedAnswer: { '@type': 'Answer', text: 'Historically, small-cap and mid-cap equity funds have given 15–20% p.a. over 10+ year periods. Nifty 50 index funds have given approximately 12–13% p.a. consistently. Past returns are not guaranteed.' } },
          { '@type': 'Question', name: 'What is the difference between CAGR and absolute return in mutual funds?', acceptedAnswer: { '@type': 'Answer', text: 'Absolute return = ((Total − Invested) / Invested) × 100 — total gain without time. CAGR is the equivalent yearly return. For SIPs, XIRR is most accurate — it\'s what Zerodha, Groww, and Kuvera report.' } },
          { '@type': 'Question', name: 'Is mutual fund SIP better than FD for long-term investment?', acceptedAnswer: { '@type': 'Answer', text: 'For 7+ year horizons, equity SIPs have historically delivered 12–15% p.a. vs FD rates of 6.5–7.5%. LTCG on equity gains above ₹1.25L is 12.5% vs FD interest taxed at slab rate (up to 30%).' } },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MutualFundCalculatorClient {...defaults} />
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <MFContent />
      </div>
    </>
  );
}
