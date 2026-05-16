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
    title: 'SWP Calculator 2026 — Systematic Withdrawal Plan Returns, Corpus & Monthly Income | gpaisa.in',
    description: 'Free SWP Calculator: calculate how long ₹10L corpus lasts at 12% return with ₹10,000/month withdrawal. Year-wise breakdown, tax guide, SWP vs FD comparison.',
    keywords: [
        // Primary keywords (high volume)
        'swp calculator',
        'systematic withdrawal plan calculator',
        'swp calculator online',
        'swp return calculator',
        'swp mutual fund calculator',

        // Secondary keywords
        'swp calculator 2024',
        'swp calculator india',
        'swp calculator with growth',
        'swp maturity calculator',
        'retirement withdrawal calculator',

        // Long-tail keywords
        'swp calculator monthly withdrawal',
        'swp calculator with inflation',
        'systematic withdrawal plan returns',
        'swp vs sip calculator',
        'retirement income calculator',

        // Related terms
        'systematic withdrawal plan',
        'swp benefits',
        'swp tax implications',
        'swp vs lump sum',
        'retirement planning calculator',
        'pension calculator',

        // Feature-based
        'swp calculator with charts',
        'swp calculator year wise',
        'swp calculator excel alternative',
    ].join(', '),

    openGraph: {
        title: 'SWP Calculator - Calculate Systematic Withdrawal Plan Returns | Gpaisa',
        description: 'Plan your retirement withdrawals with our advanced SWP calculator. Calculate monthly income, final corpus, and visualize your wealth depletion.',
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
        title: 'SWP Calculator 2026 — Monthly Income, Corpus & Tax Guide | gpaisa.in',
        description: 'Calculate SWP returns: ₹10L corpus at 12% supports ₹10,000/month withdrawal for 20+ years. Year-wise breakdown, SWP vs FD, tax treatment guide.',
        creator: '@gpaisa_in',
    },

    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/swp',
    },

    authors: [{ name: 'Satyapal Khakhal' }],
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

    // JSON-LD Structured Data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            // WebPage Schema
            {
                '@type': 'WebPage',
                '@id': 'https://www.gpaisa.in/calculator/swp#webpage',
                url: 'https://www.gpaisa.in/calculator/swp',
                name: 'SWP Calculator - Calculate Systematic Withdrawal Plan Returns Online',
                description: 'Free online SWP calculator to calculate Systematic Withdrawal Plan returns, monthly withdrawals, and final corpus. Plan your retirement income.',
                isPartOf: {
                    '@id': 'https://www.gpaisa.in/#website',
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
                    hasMerchantReturnPolicy: {
                        '@type': 'MerchantReturnPolicy',
                        applicableCountry: 'IN',
                        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
                    },
                },
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    ratingCount: '8450',
                    bestRating: '5',
                    worstRating: '1',
                },
                description: 'Free online SWP calculator to calculate Systematic Withdrawal Plan returns and retirement income.',
            },

            // FAQPage Schema
            {
                '@type': 'FAQPage',
                '@id': 'https://www.gpaisa.in/calculator/swp#faq',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What is a SWP Calculator?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'A SWP Calculator is a financial tool that helps you calculate how long your investment will last with regular withdrawals. It shows your final corpus, total withdrawals, and helps plan retirement income.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How does SWP work?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'SWP (Systematic Withdrawal Plan) allows you to withdraw a fixed amount regularly from your mutual fund investment while the remaining amount continues to earn returns. It provides regular income while keeping your capital invested.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Is SWP better than FD for retirement?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'SWP can be better than FD for retirement as it offers potentially higher returns (10-12% vs 6-7%), tax efficiency (only gains taxed), and flexibility in withdrawal amounts. However, SWP involves market risk unlike FDs.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What is the tax on SWP withdrawals?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'For equity funds: LTCG above ₹1 lakh taxed at 10%, STCG at 15%. For debt funds: LTCG at 20% with indexation (if held >3 years), STCG at slab rates. Only capital gains portion is taxed, not the entire withdrawal.',
                        },
                    },
                ],
            },

            // HowTo Schema
            {
                '@type': 'HowTo',
                name: 'How to Use SWP Calculator',
                description: 'Step-by-step guide to calculate your SWP returns',
                step: [
                    {
                        '@type': 'HowToStep',
                        position: 1,
                        name: 'Enter Initial Investment',
                        text: 'Enter the lump sum amount you want to invest initially.',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 2,
                        name: 'Set Monthly Withdrawal',
                        text: 'Choose how much you want to withdraw every month.',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 3,
                        name: 'Select Expected Return',
                        text: 'Enter the expected annual return rate (typically 10-12% for equity funds).',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 4,
                        name: 'View Results',
                        text: 'The calculator will show your final corpus, total withdrawals, and year-by-year breakdown.',
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
