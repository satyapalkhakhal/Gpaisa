import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Target, BookOpen, TrendingUp, PenLine, Megaphone } from 'lucide-react';
import { AUTHORS, authorPath, authorPersonId } from '@/lib/authors';
import { CALCULATORS } from '@/lib/calculatorsList';
import { GOLD_CITIES } from '@/lib/rates';
import { SILVER_CITIES } from '@/lib/silverCityList';

const founder = AUTHORS[0];
const CONTACT_EMAIL = 'contact@gpaisa.in';

const DESCRIPTION = 'gpaisa.in is an independent personal finance site for Indian readers, in English and Hindi: daily gold and silver rates, IPO coverage, market news, explainers and free calculators. Run by founder Satyapal Khakhal.';

export const metadata: Metadata = {
    title: 'About gpaisa.in: Who We Are, How We Work and Where Our Data Comes From',
    description: DESCRIPTION,
    alternates: {
        canonical: 'https://www.gpaisa.in/about',
    },
    openGraph: {
        title: 'About gpaisa.in',
        description: DESCRIPTION,
        type: 'website',
        url: 'https://www.gpaisa.in/about',
    },
};

export const dynamic = 'force-static'; // Fully static page, cached permanently

function Card({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
            <div className="flex items-center mb-5">
                {icon}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
            </div>
            {children}
        </section>
    );
}

export default function AboutPage() {
    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        // Same Person node as the author page and article markup.
        '@id': authorPersonId(founder),
        name: founder.name,
        jobTitle: founder.jobTitle,
        url: `https://www.gpaisa.in${authorPath(founder)}`,
        image: founder.image,
        worksFor: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            url: 'https://www.gpaisa.in',
        },
        description: founder.bio,
        sameAs: founder.sameAs,
        knowsAbout: founder.knowsAbout,
    };

    const aboutPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About gpaisa.in',
        url: 'https://www.gpaisa.in/about',
        description: DESCRIPTION,
        mainEntity: { '@id': authorPersonId(founder) },
        isPartOf: { '@type': 'WebSite', name: 'gpaisa.in', url: 'https://www.gpaisa.in' },
    };

    const offer = [
        {
            title: 'Gold and silver rates',
            body: <>Daily 24K, 22K and 18K gold rates for India and {GOLD_CITIES.length} cities, and silver rates for {SILVER_CITIES.length} cities, with 10-day history. See the <Link href="/gold-rate" className="text-primary-600 hover:underline">gold rate</Link> and <Link href="/silver-rate" className="text-primary-600 hover:underline">silver rate</Link> pages.</>,
        },
        {
            title: 'IPO coverage',
            body: <>Mainboard and SME IPOs from DRHP to listing: price band, dates, subscription, allotment, grey market premium (clearly labelled as unofficial) and how each debut compared with it. Start at the <Link href="/ipo" className="text-primary-600 hover:underline">IPO hub</Link>.</>,
        },
        {
            title: 'News and explainers, in English and Hindi',
            body: <>Market and business news, RBI and SEBI changes, tax rules, credit card reviews and gold market analysis, each written to answer what it means for your money. Read the <Link href="/news" className="text-primary-600 hover:underline">latest news</Link> or the <Link href="/hi" className="text-primary-600 hover:underline">Hindi edition</Link>.</>,
        },
        {
            title: 'Calculators and glossary',
            body: <>{CALCULATORS.length} free calculators (SIP, PPF, EPF, NPS, income tax, home loan, GST and more) that show the formula behind the number, and a <Link href="/glossary" className="text-primary-600 hover:underline">finance glossary</Link> of plain-language definitions.</>,
        },
    ];

    return (
        <div className="bg-gray-50 py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        About <span className="text-primary-600">gpaisa.in</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        An independent personal finance site for Indian readers, in English and Hindi, built and written by one person who checks every number against an official source.
                    </p>
                </div>

                <Card icon={<Target className="w-8 h-8 text-primary-600 mr-3" />} title="Why gpaisa.in exists">
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Most people in India make money decisions, such as buying gold on Dhanteras, applying for an IPO or choosing a credit card, from forwarded messages and headlines that leave out the numbers.
                        gpaisa.in exists to give the numbers: today&apos;s rate, the actual subscription figure, the fee you would really pay, and the worked calculation behind each conclusion.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Everything on the site is free to read, with no paywall and no sign-up.
                    </p>
                </Card>

                <Card title="What we publish">
                    <div className="grid md:grid-cols-2 gap-6">
                        {offer.map(o => (
                            <div key={o.title} className="border-l-4 border-primary-600 pl-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{o.title}</h3>
                                <p className="text-gray-700 leading-relaxed">{o.body}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card icon={<Users className="w-8 h-8 text-primary-600 mr-3" />} title="Who runs gpaisa.in">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        gpaisa.in is run by its founder, Satyapal Khakhal, who writes the articles and builds and maintains the calculators, rate pages and IPO tracker.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-5">
                            <div className="flex-shrink-0">
                                <Image
                                    src={founder.image}
                                    alt="Satyapal Khakhal, founder of gpaisa.in"
                                    width={120}
                                    height={120}
                                    className="rounded-xl object-cover border-2 border-primary-100 shadow-sm"
                                    priority
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{founder.name}</h3>
                                <p className="text-primary-600 font-semibold mb-3">{founder.jobTitle}</p>
                                <p className="text-gray-700 leading-relaxed mb-3">{founder.bio}</p>
                                <div className="flex flex-wrap gap-x-5 gap-y-2">
                                    <Link href={authorPath(founder)} className="text-primary-600 font-semibold hover:underline">
                                        All articles by {founder.name} →
                                    </Link>
                                    {founder.sameAs.map(url => (
                                        <a key={url} href={url} rel="me noopener" target="_blank" className="text-primary-600 font-semibold hover:underline">
                                            {url.includes('linkedin.com') ? 'LinkedIn profile' : url.replace(/^https?:\/\//, '')} ↗
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card icon={<PenLine className="w-8 h-8 text-primary-600 mr-3" />} title="How we write and check articles">
                    <ul className="list-disc pl-5 space-y-3 text-gray-700 leading-relaxed">
                        <li><strong>Official sources first.</strong> Figures come from RBI, SEBI, NSE and BSE, company filings (DRHP, RHP, results), government notifications and the issuing bank or fund house. Where we rely on a news report, we name and link it.</li>
                        <li><strong>Every article lists its sources</strong> at the end, and says which calculations are our own.</li>
                        <li><strong>Numbers are worked, not just quoted.</strong> Gains per lot, tax on a given amount, or the cost of a gram of jewellery with making charges are calculated and shown so you can check them.</li>
                        <li><strong>Dated and updated.</strong> Each article shows its publish date, and an updated date when it has been revised. Prices and fast-moving stories carry the time of the data they use.</li>
                        <li><strong>Information, not advice.</strong> We explain how products and markets work. We do not tell you what to buy, and the author is not a SEBI-registered investment adviser.</li>
                        <li><strong>Reviews are honest about their basis.</strong> A review says when it is based on a product the author has used, and points out costs and drawbacks as well as benefits.</li>
                    </ul>
                </Card>

                <Card icon={<TrendingUp className="w-8 h-8 text-primary-600 mr-3" />} title="Where our data comes from">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border-l-4 border-amber-500 pl-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Gold and silver rates</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Indicative rates from a third-party market data feed, per gram and per 10 grams. The all-India rate is the median of the city rates.
                                They exclude GST (3%) and making charges, and can differ from IBJA benchmark rates and your jeweller&apos;s price, so always confirm before buying.
                            </p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">IPO data</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Issue details come from the offer documents and exchange notices; subscription and listing prices from NSE and BSE.
                                Grey market premium (GMP) is unofficial and unregulated; it is always labelled as such and never presented as a prediction.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card icon={<BookOpen className="w-8 h-8 text-primary-600 mr-3" />} title="Corrections">
                    <p className="text-gray-700 leading-relaxed">
                        If you spot an error in an article, a rate or a calculator, email <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-600 hover:underline">{CONTACT_EMAIL}</a> with the page and what is wrong.
                        We check it against the source, fix the page, and update its date. Significant corrections are noted in the article.
                    </p>
                </Card>

                <Card icon={<Megaphone className="w-8 h-8 text-primary-600 mr-3" />} title="How gpaisa.in is funded">
                    <p className="text-gray-700 leading-relaxed">
                        gpaisa.in is self-funded and may show advertising, including ads served by Google. Advertisers have no say in what we write, which products we cover or how we rate them.
                        If an article ever includes sponsored content or a paid link, it will be clearly labelled.
                        See our <Link href="/privacy-policy" className="text-primary-600 hover:underline">privacy policy</Link> for how ads and cookies work on the site.
                    </p>
                </Card>

                {/* Contact CTA */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in touch</h2>
                    <p className="text-gray-700 mb-6">
                        Questions, feedback or a correction? Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-600 hover:underline">{CONTACT_EMAIL}</a> or use the contact page.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition"
                    >
                        Contact us
                    </Link>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-sm text-gray-700">
                        <strong>Disclaimer:</strong> The information on gpaisa.in is for educational and informational purposes only and is not financial or investment advice.
                        Consult a SEBI-registered investment adviser before making investment decisions. Rates and market data are indicative and can change; see our <Link href="/disclaimer" className="text-primary-600 hover:underline">full disclaimer</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
