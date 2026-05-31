import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Free Financial Calculators India — SIP, FD, EMI, GST, Home Loan | gpaisa.in',
    description: 'Use 15 free financial calculators: SIP, FD, EMI, Home Loan, GST, PPF, EPF, NPS, HRA, Gratuity, CAGR, SWP, Mutual Fund & Simple Interest. Accurate results for Indian investors.',
    authors: [{ name: 'Satyapal Khakhal', url: 'https://www.gpaisa.in/about' }],
    alternates: { canonical: 'https://www.gpaisa.in/calculator' },
    openGraph: {
        title: 'Free Financial Calculators — SIP, FD, EMI, GST & More | gpaisa.in',
        description: '15 free financial calculators for Indian investors. SIP, FD, EMI, Home Loan, GST, PPF, EPF, NPS, and more.',
        url: 'https://www.gpaisa.in/calculator',
        siteName: 'gpaisa.in',
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Financial Calculators India | gpaisa.in',
        description: '15 free calculators: SIP, FD, EMI, Home Loan, GST, PPF, and more.',
        creator: '@gpaisa_in',
        site: '@gpaisa_in',
    },
};

const calculators = [
    { name: 'SIP Calculator', desc: 'Calculate your Systematic Investment Plan returns. Plan mutual fund investments with projected growth over time.', href: '/calculator/sip', icon: '📊', category: 'Investment' },
    { name: 'FD Calculator', desc: 'Calculate Fixed Deposit maturity amount and interest earned. Compare FD returns across different tenures.', href: '/calculator/fd', icon: '🏦', category: 'Savings' },
    { name: 'Home Loan Calculator', desc: 'Calculate your home loan EMI, total interest payable, and get a full amortization schedule.', href: '/calculator/home-loan', icon: '🏠', category: 'Loans' },
    { name: 'EMI Calculator', desc: 'Calculate Equated Monthly Installment for any loan type — personal, car, or education loan.', href: '/calculator/emi', icon: '💰', category: 'Loans' },
    { name: 'GST Calculator', desc: 'Add or remove GST (5%, 12%, 18%, 28%) from any amount. Essential for business and invoicing.', href: '/calculator/gst', icon: '🧾', category: 'Tax' },
    { name: 'SWP Calculator', desc: 'Plan systematic withdrawals from your mutual fund investments. Calculate monthly income from your corpus.', href: '/calculator/swp', icon: '💸', category: 'Investment' },
    { name: 'PPF Calculator', desc: 'Calculate Public Provident Fund maturity amount with yearly contributions and compound interest.', href: '/calculator/ppf', icon: '📈', category: 'Savings' },
    { name: 'EPF Calculator', desc: 'Estimate your Employee Provident Fund balance at retirement including employer contribution.', href: '/calculator/epf', icon: '🏢', category: 'Retirement' },
    { name: 'CAGR Calculator', desc: 'Calculate Compound Annual Growth Rate for your investments. Compare returns across asset classes.', href: '/calculator/cagr', icon: '📉', category: 'Investment' },
    { name: 'NPS Calculator', desc: 'Estimate your National Pension System corpus and monthly pension at retirement.', href: '/calculator/nps', icon: '🧓', category: 'Retirement' },
    { name: 'HRA Calculator', desc: 'Calculate HRA exemption under Section 10(13A) for income tax savings.', href: '/calculator/hra', icon: '🏘️', category: 'Tax' },
    { name: 'Gratuity Calculator', desc: 'Calculate gratuity amount based on years of service and last drawn salary.', href: '/calculator/gratuity', icon: '🎖️', category: 'Retirement' },
    { name: 'Mutual Fund Calculator', desc: 'Calculate lump sum mutual fund investment returns with compound growth projections.', href: '/calculator/mutual-fund', icon: '📊', category: 'Investment' },
    { name: 'Simple Interest Calculator', desc: 'Calculate simple interest on deposits, loans, or any principal amount.', href: '/calculator/simple-interest', icon: '🔢', category: 'Basics' },
];

export default function CalculatorHubPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Financial Calculators — gpaisa.in',
        'description': 'Free financial calculators for Indian investors',
        'numberOfItems': calculators.length,
        'itemListElement': calculators.map((calc, i) => ({
            '@type': 'ListItem',
            'position': i + 1,
            'name': calc.name,
            'url': `https://www.gpaisa.in${calc.href}`,
        })),
    };

    const categories = ['Investment', 'Savings', 'Loans', 'Tax', 'Retirement', 'Basics'];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-gray-50 min-h-screen">
                {/* Hero */}
                <section className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white py-10 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3">
                            Free Financial Calculators for India
                        </h1>
                        <p className="text-emerald-200 text-sm sm:text-base max-w-2xl mx-auto">
                            {calculators.length} accurate, free calculators for SIP, FD, EMI, Home Loan, GST, PPF, and more.
                            Make smarter financial decisions with gpaisa.in.
                        </p>
                        <p className="text-emerald-300 text-xs mt-3">
                            By <Link href="/about" className="underline text-white font-semibold">Satyapal Khakhal</Link> · Updated for 2026
                        </p>
                    </div>
                </section>

                {/* Calculator Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {categories.map(category => {
                        const categoryCalcs = calculators.filter(c => c.category === category);
                        if (categoryCalcs.length === 0) return null;
                        return (
                            <div key={category} className="mb-8">
                                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-1 h-5 rounded-full bg-emerald-500" />
                                    {category} Calculators
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categoryCalcs.map(calc => (
                                        <Link
                                            key={calc.href}
                                            href={calc.href}
                                            className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl flex-shrink-0">{calc.icon}</span>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                                        {calc.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                        {calc.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Trust Section */}
                    <div className="mt-8 bg-emerald-50 rounded-xl border border-emerald-100 p-6 text-center">
                        <p className="text-sm text-emerald-700 leading-relaxed max-w-2xl mx-auto">
                            All calculators on gpaisa.in are built with accuracy in mind and follow the latest
                            Indian tax rules and financial regulations for 2026. Results are for educational
                            purposes only — please consult a SEBI-registered advisor before making investment decisions.
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <Link href="/about" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                                About Us →
                            </Link>
                            <Link href="/disclaimer" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                                Disclaimer →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
