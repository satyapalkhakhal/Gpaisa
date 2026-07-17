'use client';

import GoldDashboardHero from '@/components/GoldDashboardHero';
import GoldPriceTable from '@/components/GoldPriceTable';
import GoldTodayVsYesterday from '@/components/GoldTodayVsYesterday';
import GoldTrendTable from '@/components/GoldTrendTable';
import DynamicGoldChart from '@/components/DynamicGoldChart';
import CityGoldRatesTable from '@/components/CityGoldRatesTable';
import GoldPriceHistoryChart from '@/components/GoldPriceHistoryChart';
import GoldNewsSection from '@/components/GoldNewsSection';
import { MarketInsight, DecisionBlock, InternalLinks, GoldFAQ } from '@/components/GoldDashboardSections';

interface GoldRatePageClientProps {
    todayDate: string;
    initialHeroData?: {
        price24k10g: number;
        change: number;
        changePercent: number;
        trend: 'Bullish' | 'Bearish' | 'Neutral';
        lastUpdated: string;
    } | null;
}

export default function GoldRatePageClient({ todayDate, initialHeroData = null }: GoldRatePageClientProps) {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* SECTION 1: Hero — Live Price Above the Fold */}
            <GoldDashboardHero todayDate={todayDate} initialData={initialHeroData} />

            {/* SECTION 2: Gold Price Table — All Purities with Gram/Tola */}
            <GoldPriceTable />

            {/* SECTION 3: Today vs Yesterday Comparison */}
            <GoldTodayVsYesterday />

            {/* SECTION 4: 7-Day Trend Table */}
            <GoldTrendTable days={7} title="📈 7-Day Gold Price Trend" />

            {/* SECTION 5: 10-Day Trend Table (Extended) */}
            <GoldTrendTable days={10} title="📈 10-Day Gold Price Trend (Extended)" />

            {/* Gold Price Trend Chart */}
            <section className="mb-8 sm:mb-12">
                <h2 className="text-lg sm:text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📊 Gold Price Trend Chart (24K)
                </h2>
                <DynamicGoldChart carat="24k" city="India" />
            </section>

            {/* Historical Gold Prices — 62 Years of Data */}
            <GoldPriceHistoryChart />

            {/* SECTION 6: Quick Market Insight */}
            <MarketInsight />

            {/* SECTION 7: Decision Block */}
            <DecisionBlock />

            {/* City-wise Gold Rates */}
            <div id="city-gold-rates">
                <CityGoldRatesTable />
            </div>

            {/* Gold News */}
            <GoldNewsSection />

            {/* SECTION 8: Internal Links */}
            <InternalLinks />

            {/* SECTION 9: FAQ Section */}
            <GoldFAQ />

            {/* Data Source Disclaimer */}
            <aside className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">📋</span>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">About Our Data</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Gold rates on gpaisa.in are sourced from MCX and IBJA data feeds, updated every market hour on weekdays. Rates reflect spot prices and may vary from retail jeweller prices due to making charges, GST (3%), and local taxes.
                        </p>
                    </div>
                </div>
            </aside>
        </div>
    );
}
