import { MarketIndex, Stock, GoldRate, Commodity, AgriculturePrice, Article, ChartDataPoint } from '@/types';

// Market Indices Mock Data
export const marketIndices: MarketIndex[] = [
    {
        name: 'Sensex',
        symbol: 'SENSEX:INDEXBOM',
        value: 72240.26,
        change: 234.12,
        changePercent: 0.32,
        lastUpdated: new Date().toISOString(),
    },
    {
        name: 'Nifty 50',
        symbol: 'NIFTY_50:INDEXNSE',
        value: 21731.40,
        change: -45.30,
        changePercent: -0.21,
        lastUpdated: new Date().toISOString(),
    },
    {
        name: 'Nifty Bank',
        symbol: 'NIFTY_BANK:INDEXNSE',
        value: 46892.15,
        change: 156.80,
        changePercent: 0.33,
        lastUpdated: new Date().toISOString(),
    },
    {
        name: 'USD/INR',
        symbol: 'USD-INR',
        value: 83.12,
        change: 0.15,
        changePercent: 0.18,
        lastUpdated: new Date().toISOString(),
    },
];

// Stocks Mock Data
export const stocks: Stock[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.30, change: 12.50, changePercent: 0.51, volume: '2.5M', marketCap: '₹16.6L Cr' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3678.90, change: -23.40, changePercent: -0.63, volume: '1.8M', marketCap: '₹13.4L Cr' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1623.45, change: 8.20, changePercent: 0.51, volume: '3.2M', marketCap: '₹12.3L Cr' },
    { symbol: 'INFY', name: 'Infosys', price: 1456.75, change: -5.60, changePercent: -0.38, volume: '2.1M', marketCap: '₹6.1L Cr' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 987.60, change: 15.30, changePercent: 1.57, volume: '4.5M', marketCap: '₹6.9L Cr' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1234.80, change: 22.10, changePercent: 1.82, volume: '1.9M', marketCap: '₹7.2L Cr' },
    { symbol: 'SBIN', name: 'State Bank of India', price: 623.45, change: -3.20, changePercent: -0.51, volume: '5.6M', marketCap: '₹5.6L Cr' },
    { symbol: 'WIPRO', name: 'Wipro', price: 456.30, change: 2.80, changePercent: 0.62, volume: '1.4M', marketCap: '₹2.5L Cr' },
];

// Gold Rates Mock Data
export const goldRates: GoldRate[] = [
    { purity: '24K', pricePerGram: 6245, pricePerTola: 72850, change: 50, changePercent: 0.81 },
    { purity: '22K', pricePerGram: 5725, pricePerTola: 66780, change: 45, changePercent: 0.79 },
    { purity: '18K', pricePerGram: 4684, pricePerTola: 54638, change: 38, changePercent: 0.82 },
];

// Commodities Mock Data
export const commodities: Commodity[] = [
    { name: 'Gold', symbol: 'GOLD', price: 6245, unit: '₹/gram', change: 50, changePercent: 0.81 },
    { name: 'Silver', symbol: 'SILVER', price: 74.50, unit: '₹/gram', change: -0.80, changePercent: -1.06 },
    { name: 'Crude Oil', symbol: 'CRUDEOIL', price: 6823, unit: '₹/barrel', change: 45, changePercent: 0.66 },
    { name: 'Natural Gas', symbol: 'NATURALGAS', price: 234.50, unit: '₹/mmbtu', change: -5.20, changePercent: -2.17 },
    { name: 'Copper', symbol: 'COPPER', price: 723.40, unit: '₹/kg', change: 3.20, changePercent: 0.44 },
    { name: 'Zinc', symbol: 'ZINC', price: 234.80, unit: '₹/kg', change: -1.50, changePercent: -0.63 },
];

// Agriculture Prices Mock Data
export const agriculturePrices: AgriculturePrice[] = [
    { id: '1', crop: 'Wheat', state: 'Punjab', mandi: 'Ludhiana', price: 2250, unit: '₹/quintal', date: '2026-01-01', change: 25 },
    { id: '2', crop: 'Rice', state: 'Haryana', mandi: 'Karnal', price: 3450, unit: '₹/quintal', date: '2026-01-01', change: -30 },
    { id: '3', crop: 'Sugarcane', state: 'Uttar Pradesh', mandi: 'Meerut', price: 340, unit: '₹/quintal', date: '2026-01-01', change: 5 },
    { id: '4', crop: 'Cotton', state: 'Gujarat', mandi: 'Rajkot', price: 6780, unit: '₹/quintal', date: '2026-01-01', change: 120 },
    { id: '5', crop: 'Soybean', state: 'Madhya Pradesh', mandi: 'Indore', price: 4560, unit: '₹/quintal', date: '2026-01-01', change: -45 },
    { id: '6', crop: 'Maize', state: 'Karnataka', mandi: 'Bangalore', price: 1890, unit: '₹/quintal', date: '2026-01-01', change: 15 },
    { id: '7', crop: 'Onion', state: 'Maharashtra', mandi: 'Nashik', price: 2340, unit: '₹/quintal', date: '2026-01-01', change: 180 },
    { id: '8', crop: 'Potato', state: 'West Bengal', mandi: 'Kolkata', price: 1250, unit: '₹/quintal', date: '2026-01-01', change: -80 },
    { id: '9', crop: 'Tomato', state: 'Andhra Pradesh', mandi: 'Guntur', price: 3200, unit: '₹/quintal', date: '2026-01-01', change: 450 },
    { id: '10', crop: 'Turmeric', state: 'Tamil Nadu', mandi: 'Erode', price: 8900, unit: '₹/quintal', date: '2026-01-01', change: 120 },
];

// Articles Mock Data
export const articles: Article[] = [
    {
        id: '1',
        slug: '10-best-tax-saving-investment-options-for-2026',
        title: '10 Best Tax Saving Investment Options for 2026',
        excerpt: 'Discover the top tax-saving investment schemes under Section 80C that can help you save up to ₹1.5 lakh in taxes while building wealth.',
        category: 'tax-saving',
        author: 'Priya Sharma',
        publishedAt: '2026-01-01',
        readTime: '5 min read',
        tags: ['Tax Planning', 'Section 80C', 'Investments'],
    },
    {
        id: '2',
        slug: 'gold-vs-fixed-deposits-which-is-better-in-2026',
        title: 'Gold vs. Fixed Deposits: Which is Better in 2026?',
        excerpt: 'A comprehensive comparison of gold investments and fixed deposits to help you make informed decisions about your savings.',
        category: 'investments',
        author: 'Rajesh Kumar',
        publishedAt: '2025-12-30',
        readTime: '7 min read',
        tags: ['Gold', 'FD', 'Comparison'],
    },
    {
        id: '3',
        slug: 'home-loan-interest-rates-complete-guide-2026',
        title: 'Home Loan Interest Rates: Complete Guide 2026',
        excerpt: 'Everything you need to know about home loan interest rates, eligibility, and how to get the best deals from top banks.',
        category: 'loans',
        author: 'Amit Patel',
        publishedAt: '2025-12-29',
        readTime: '6 min read',
        tags: ['Home Loan', 'Interest Rates', 'Banking'],
    },
    {
        id: '4',
        slug: 'understanding-mutual-funds-a-beginners-guide',
        title: 'Understanding Mutual Funds: A Beginner\'s Guide',
        excerpt: 'Learn the basics of mutual fund investing, types of funds, and how to start your investment journey with as little as ₹500.',
        category: 'basics',
        author: 'Sneha Reddy',
        publishedAt: '2025-12-28',
        readTime: '8 min read',
        tags: ['Mutual Funds', 'Beginner', 'SIP'],
    },
    {
        id: '5',
        slug: 'rbi-monetary-policy-impact-on-your-investments',
        title: 'RBI Monetary Policy: Impact on Your Investments',
        excerpt: 'Analysis of the latest RBI monetary policy decisions and their implications for your savings and investment portfolio.',
        category: 'news',
        author: 'Vikram Singh',
        publishedAt: '2025-12-27',
        readTime: '4 min read',
        tags: ['RBI', 'Policy', 'Economy'],
    },
    {
        id: '6',
        slug: 'ppf-vs-nps-which-retirement-plan-is-right-for-you',
        title: 'PPF vs. NPS: Which Retirement Plan is Right for You?',
        excerpt: 'Compare Public Provident Fund and National Pension System to choose the best retirement savings option for your goals.',
        category: 'investments',
        author: 'Meera Iyer',
        publishedAt: '2025-12-26',
        readTime: '6 min read',
        tags: ['PPF', 'NPS', 'Retirement'],
    },
];

// Chart Data Mock
export const generateChartData = (days: number = 30): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const now = new Date();
    let baseValue = 70000;

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Random walk with slight upward trend
        baseValue += (Math.random() - 0.45) * 500;

        data.push({
            time: date.toISOString().split('T')[0],
            value: Math.round(baseValue * 100) / 100,
        });
    }

    return data;
};

export const sensexChartData = generateChartData(30);
export const goldChartData = generateChartData(30);
