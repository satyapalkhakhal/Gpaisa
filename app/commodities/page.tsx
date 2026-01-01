import { Metadata } from 'next';
import PriceCard from '@/components/PriceCard';
import ChartCard from '@/components/ChartCard';
import { goldRates, commodities, goldChartData } from '@/lib/mockData';
import { getLastUpdatedTime } from '@/lib/utils';
import { Coins, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Live Gold & Silver Rates, Commodity Prices Today | gpaisa.in',
    description: 'Check today\'s gold rates (24K, 22K, 18K), silver prices, and other commodity rates across India. Updated in real-time.',
};

export default function CommoditiesPage() {
    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Gold & Commodities</h1>
                    <p className="text-lg text-gray-600">Live gold, silver, and commodity prices across India</p>
                </div>

                {/* Gold Rates */}
                <section className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                        <Coins className="h-7 w-7 text-primary-600" />
                        <h2 className="text-2xl font-display font-semibold text-gray-900">Gold Rates</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {goldRates.map((rate) => (
                            <div key={rate.purity}>
                                <PriceCard
                                    title={`Gold ${rate.purity}`}
                                    value={`₹${rate.pricePerGram.toLocaleString('en-IN')}`}
                                    change={rate.change}
                                    changePercent={rate.changePercent}
                                    subtitle="per gram"
                                    variant="gold"
                                />
                                <div className="mt-2 text-center">
                                    <p className="text-sm text-gray-600">
                                        Per 10g: <span className="font-semibold">₹{(rate.pricePerGram * 10).toLocaleString('en-IN')}</span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Per Tola: <span className="font-semibold">₹{rate.pricePerTola.toLocaleString('en-IN')}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Gold Chart */}
                <section className="mb-12">
                    <ChartCard title="Gold Price Trend (24K) - Last 30 Days" data={goldChartData} color="#f0760b" height={400} />
                </section>

                {/* Other Commodities */}
                <section>
                    <div className="flex items-center space-x-3 mb-6">
                        <TrendingUp className="h-7 w-7 text-primary-600" />
                        <h2 className="text-2xl font-display font-semibold text-gray-900">Other Commodities</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {commodities.map((commodity) => (
                            <PriceCard
                                key={commodity.symbol}
                                title={commodity.name}
                                value={`₹${commodity.price.toLocaleString('en-IN')}`}
                                change={commodity.change}
                                changePercent={commodity.changePercent}
                                subtitle={commodity.unit}
                                variant={commodity.change >= 0 ? 'success' : 'danger'}
                            />
                        ))}
                    </div>
                </section>

                {/* Information Box */}
                <div className="mt-12 card bg-primary-50 border-primary-200">
                    <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">About Gold Rates</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                        <p>
                            <strong>24K Gold:</strong> 99.9% pure gold, also known as 24 carat gold. This is the purest form of gold available.
                        </p>
                        <p>
                            <strong>22K Gold:</strong> 91.67% pure gold, commonly used for making jewelry in India.
                        </p>
                        <p>
                            <strong>18K Gold:</strong> 75% pure gold, often used for modern and designer jewelry.
                        </p>
                        <p className="text-xs text-gray-600 mt-4">
                            Note: Gold prices vary by city and may include making charges and GST. Always verify with local jewelers.
                        </p>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Last updated: {getLastUpdatedTime()} IST
                    </p>
                </div>
            </div>
        </div>
    );
}
