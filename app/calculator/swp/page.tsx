import { Metadata } from 'next';
import SWPCalculatorClient from '@/components/SWPCalculatorClient';
import SWPContent from '@/components/swp/SWPContent';
import type { YearRow } from '@/components/SWPCalculatorClient';

// Pre-compute SWP defaults server-side (₹10L, ₹10K/mo, 12%, 20yr)
function computeSWPDefaults() {
  const initialInvestment = 1000000;
  const monthlyWithdrawal = 10000;
  const monthlyRate = 12 / 12 / 100;
  const timePeriod = 20;

  let balance = initialInvestment;
  const yearlyData: YearRow[] = [];
  let totalWithdrawn = 0;
  let monthsLasted = 0;

  for (let year = 1; year <= timePeriod; year++) {
    const openingBalance = balance;
    let yearlyWithdrawal = 0;
    let yearlyReturns = 0;
    for (let month = 1; month <= 12; month++) {
      if (balance <= 0) break;
      const withdrawal = Math.min(monthlyWithdrawal, balance);
      balance -= withdrawal;
      yearlyWithdrawal += withdrawal;
      totalWithdrawn += withdrawal;
      monthsLasted++;
      if (balance <= 0) break;
      const ret = balance * monthlyRate;
      balance += ret;
      yearlyReturns += ret;
    }
    yearlyData.push({
      year,
      openingBalance: Math.round(openingBalance),
      withdrawal: Math.round(yearlyWithdrawal),
      returns: Math.round(yearlyReturns),
      closingBalance: Math.max(0, Math.round(balance)),
    });
    if (balance <= 0) break;
  }

  return {
    totalWithdrawal: Math.round(totalWithdrawn),
    finalCorpus: Math.max(0, Math.round(balance)),
    totalMonths: monthsLasted,
    yearlyData,
  };
}

// Comprehensive SEO metadata targeting high-volume keywords
export const metadata: Metadata = {
    title: 'SWP Calculator 2026 — Systematic Withdrawal Plan with Inflation & Tax | gpaisa.in',
    description: "India's most complete SWP calculator. Calculate final corpus, safe withdrawal rate, inflation-adjusted returns, and corpus depletion date. Compare SWP vs FD vs Annuity. Free online tool.",
    authors: [{ name: 'Satyapal Khakhal' }],

    openGraph: {
        title: 'SWP Calculator 2026 — Inflation, Safe Withdrawal & Depletion Date | gpaisa.in',
        description: "India's most complete SWP calculator. Calculate safe withdrawal rate, inflation-adjusted returns, and corpus depletion date. Compare SWP vs FD vs Annuity.",
        type: 'website',
        url: 'https://www.gpaisa.in/calculator/swp',
        siteName: 'Gpaisa',
        images: [
            {
                url: '/og-swp-calculator.jpg',
                width: 1200,
                height: 630,
                alt: 'SWP Calculator - Systematic Withdrawal Plan Calculator',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'SWP Calculator 2026 — Inflation, Safe Withdrawal & Depletion | gpaisa.in',
        description: 'Calculate SWP: ₹10L corpus at 12% supports ₹10,000/month for 20+ years. Inflation-adjusted real value, corpus depletion warning, SWP vs FD vs Annuity.',
        creator: '@gpaisa_in',
    },

    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/swp',
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

export default function SWPCalculatorPage() {
    const defaults = computeSWPDefaults();

    // JSON-LD Structured Data for SEO — updated FAQ with exact specified Q&A
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            // WebPage Schema
            {
                '@type': 'WebPage',
                '@id': 'https://www.gpaisa.in/calculator/swp#webpage',
                url: 'https://www.gpaisa.in/calculator/swp',
                name: "SWP Calculator 2026 — Systematic Withdrawal Plan with Inflation & Tax | gpaisa.in",
                description: "India's most complete SWP calculator. Calculate final corpus, safe withdrawal rate, inflation-adjusted returns, and corpus depletion date.",
                isPartOf: {
                    '@id': 'https://www.gpaisa.in/#website',
                },
                author: {
                    '@type': 'Person',
                    name: 'Satyapal Khakhal',
                },
                breadcrumb: {
                    '@id': 'https://www.gpaisa.in/calculator/swp#breadcrumb',
                },
                inLanguage: 'en-IN',
            },

            // BreadcrumbList Schema
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://www.gpaisa.in/calculator/swp#breadcrumb',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: 'https://www.gpaisa.in',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Calculator',
                        item: 'https://www.gpaisa.in/calculator',
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: 'SWP Calculator',
                        item: 'https://www.gpaisa.in/calculator/swp',
                    },
                ],
            },

            // SoftwareApplication Schema
            {
                '@type': 'SoftwareApplication',
                name: 'SWP Calculator',
                applicationCategory: 'FinanceApplication',
                operatingSystem: 'Web',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'INR',
                },
                description: 'Free online SWP calculator with inflation adjustment, safe withdrawal rate, and corpus depletion date. Compare SWP vs FD vs Annuity.',
            },

            // FAQPage Schema — exact Q&A as specified
            {
                '@type': 'FAQPage',
                '@id': 'https://www.gpaisa.in/calculator/swp#faq',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What is a safe SWP withdrawal rate?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: '0.8–1% monthly (9.6–12% annually) if corpus earns 12–14% in diversified equity. At 1% monthly withdrawal, ₹10 lakh corpus supports ₹10,000/month withdrawal indefinitely.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Can SWP corpus run out?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes if withdrawal exceeds returns. Our calculator shows exact depletion date based on your corpus, withdrawal amount, and expected return rate.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Is SWP better than FD for retirement?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'For 20–30% tax bracket investors, yes — significantly more tax-efficient and higher income. FD interest is taxed at your full slab rate; SWP gains from equity funds held 1+ year are taxed at 10% LTCG on only the gains portion.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What is the minimum corpus for SWP?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'For ₹10,000/month sustainable withdrawal at 12% return, minimum corpus = ₹10,00,000. Formula: Minimum Corpus = Monthly Withdrawal ÷ Monthly Return Rate.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How is SWP different from dividend option?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'SWP gives you control over amount and timing. Dividends are at the AMC\'s discretion and taxed at full slab rate. SWP from equity funds held over 1 year is taxed at 10% LTCG on gains only.',
                        },
                    },
                ],
            },

            // HowTo Schema
            {
                '@type': 'HowTo',
                name: 'How to Use SWP Calculator',
                description: 'Step-by-step guide to calculate your SWP returns and safe withdrawal rate',
                step: [
                    {
                        '@type': 'HowToStep',
                        position: 1,
                        name: 'Enter Initial Investment',
                        text: 'Enter the lump sum amount you want to invest initially (default: ₹10,00,000).',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 2,
                        name: 'Set Monthly Withdrawal',
                        text: 'Choose how much you want to withdraw every month (default: ₹10,000).',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 3,
                        name: 'Select Expected Return',
                        text: 'Enter the expected annual return rate (default: 12% for diversified equity funds).',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 4,
                        name: 'Enable Inflation Adjustment (Optional)',
                        text: 'Toggle inflation adjustment to see the real purchasing power of your corpus over time.',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 5,
                        name: 'View Results',
                        text: 'See final corpus, safe withdrawal amount, depletion warning, and year-by-year breakdown.',
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
            <SWPCalculatorClient
                initialTotalWithdrawal={defaults.totalWithdrawal}
                initialFinalCorpus={defaults.finalCorpus}
                initialTotalMonths={defaults.totalMonths}
                initialYearlyData={defaults.yearlyData}
            />

            {/* Static educational content — server-rendered, visible without JS */}
            <div className="max-w-6xl mx-auto px-4 pb-10">
                <SWPContent first5Years={defaults.yearlyData.slice(0, 5)} />
            </div>
        </>
    );
}
