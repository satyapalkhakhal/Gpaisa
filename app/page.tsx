import { Metadata } from 'next';
import PriceCard from '@/components/PriceCard';
import ArticleCard from '@/components/ArticleCard';
import AgricultureTable from '@/components/AgricultureTable';
import ChartCard from '@/components/ChartCard';
import { marketIndices, goldRates, commodities, agriculturePrices, articles, sensexChartData } from '@/lib/mockData';
import { getLastUpdatedTime } from '@/lib/utils';
import { TrendingUp, Coins, Wheat, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'gpaisa.in - Live Market Updates, Gold Rates & Financial News',
    description: 'Get real-time stock market updates, gold & silver rates, commodity prices, agriculture market data, and personal finance tips.',
};

export default function HomePage() {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Your Trusted Financial Portal
                        </h1>
                        <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                            Real-time market updates, gold rates, commodity prices, and expert financial advice for India
                        </p>
                    </div>
                </div>
            </section>

            {/* Market Snapshot */}
            <section className="py-12 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <TrendingUp className="h-8 w-8 text-primary-600" />
                            <h2 className="text-3xl font-display font-bold text-gray-900">Market Snapshot</h2>
                        </div>
                        <Link href="/markets" className="text-primary-600 hover:text-primary-700 font-medium">
                            View All Markets →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {marketIndices.map((index) => (
                            <PriceCard
                                key={index.symbol}
                                title={index.name}
                                value={index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                change={index.change}
                                changePercent={index.changePercent}
                                subtitle={index.symbol}
                            />
                        ))}
                    </div>

                    <div className="mt-8">
                        <ChartCard title="Sensex - 30 Day Trend" data={sensexChartData} />
                    </div>
                </div>
            </section>

            {/* Gold & Silver Rates */}
            <section className="py-12 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <Coins className="h-8 w-8 text-primary-600" />
                            <h2 className="text-3xl font-display font-bold text-gray-900">Gold & Silver Rates</h2>
                        </div>
                        <Link href="/commodities" className="text-primary-600 hover:text-primary-700 font-medium">
                            View All Commodities →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {goldRates.map((rate) => (
                            <PriceCard
                                key={rate.purity}
                                title={`Gold ${rate.purity}`}
                                value={`₹${rate.pricePerGram.toLocaleString('en-IN')}`}
                                change={rate.change}
                                changePercent={rate.changePercent}
                                subtitle="per gram"
                                variant="gold"
                            />
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PriceCard
                            title="Silver"
                            value={`₹${commodities[1].price.toLocaleString('en-IN')}`}
                            change={commodities[1].change}
                            changePercent={commodities[1].changePercent}
                            subtitle="per gram"
                        />
                    </div>
                </div>
            </section>

            {/* Agriculture Prices */}
            <section className="py-12 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <Wheat className="h-8 w-8 text-primary-600" />
                            <h2 className="text-3xl font-display font-bold text-gray-900">Agriculture Prices</h2>
                        </div>
                        <Link href="/agriculture" className="text-primary-600 hover:text-primary-700 font-medium">
                            View All Prices →
                        </Link>
                    </div>

                    <div className="card overflow-hidden p-0">
                        <AgricultureTable data={agriculturePrices.slice(0, 5)} />
                    </div>
                </div>
            </section>

            {/* Personal Finance Articles */}
            <section className="py-12 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <BookOpen className="h-8 w-8 text-primary-600" />
                            <h2 className="text-3xl font-display font-bold text-gray-900">Personal Finance</h2>
                        </div>
                        <Link href="/finance" className="text-primary-600 hover:text-primary-700 font-medium">
                            View All Articles →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.slice(0, 3).map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Last Updated */}
            <section className="py-6 bg-white border-t border-gray-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="text-sm text-gray-500 text-center">
                        Last updated: {getLastUpdatedTime()} IST
                    </p>
                </div>
            </section>
        </div>
    );
}
