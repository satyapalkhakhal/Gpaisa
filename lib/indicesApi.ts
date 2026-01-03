import { MarketIndex } from '@/types';

const INDICES = [
    { name: 'NIFTY 50', ticker: 'NIFTY_50:INDEXNSE' },
    { name: 'SENSEX', ticker: 'SENSEX:INDEXBOM' },
    { name: 'NIFTY BANK', ticker: 'NIFTY_BANK:INDEXNSE' },
    { name: 'USD/INR', ticker: 'USD-INR' },
];

export async function fetchMarketIndices(): Promise<MarketIndex[]> {
    try {
        const promises = INDICES.map(async (index) => {
            try {
                const response = await fetch(`https://www.google.com/finance/quote/${index.ticker}`, {
                    next: { revalidate: 60 }, // Cache for 60 seconds
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch');

                const html = await response.text();

                // Extract Main Price - specific class for main header price "YMlKec fxKbKc"
                // We use a regex that looks for the specific class combination
                const priceRegex = /class="YMlKec fxKbKc">([^<]+)</;
                const priceMatch = html.match(priceRegex);

                // Fallback to generic if specific not found
                const priceStr = priceMatch ? priceMatch[1] : (html.match(/class="YMlKec[^"]*">([^<]+)</)?.[1] || '0');
                const price = parseFloat(priceStr.replace(/,/g, ''));

                // Extract Change Percent - Look for aria-label="Up by 0.50%" AFTER the price match
                // This prevents picking up the "Market Summary" strip at the top
                let changePercent = 0;
                let isPositive = true;

                const searchStartIndex = priceMatch ? (priceMatch.index || 0) : 0;
                const htmlAfterPrice = html.substring(searchStartIndex);

                const changeMatch = htmlAfterPrice.match(/aria-label="(Up|Down) by ([0-9.]+)%"/);

                if (changeMatch) {
                    isPositive = changeMatch[1] === 'Up';
                    changePercent = parseFloat(changeMatch[2]);
                    if (!isPositive) changePercent = -changePercent;
                }

                // Calculate absolute change
                // current = old * (1 + percent/100)
                // old = current / (1 + percent/100)
                // change = current - old
                const oldPrice = price / (1 + changePercent / 100);
                const change = price - oldPrice;

                return {
                    name: index.name,
                    symbol: index.ticker,
                    value: price,
                    change: change,
                    changePercent: changePercent,
                    lastUpdated: new Date().toISOString()
                };
            } catch (err) {
                console.error(`Error fetching ${index.name}:`, err);
                return {
                    name: index.name,
                    symbol: index.ticker,
                    value: 0,
                    change: 0,
                    changePercent: 0,
                    lastUpdated: new Date().toISOString()
                };
            }
        });

        const results = await Promise.all(promises);
        return results.filter(r => r.value > 0);
    } catch (error) {
        console.error('Error fetching market indices:', error);
        return [];
    }
}
