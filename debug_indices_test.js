
const INDICES = [
    { name: 'SENSEX', ticker: 'SENSEX:INDEXBOM' },
];

async function run() {
    console.log('Starting fetch...');
    for (const index of INDICES) {
        try {
            const url = `https://www.google.com/finance/quote/${index.ticker}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const html = await response.text();

            const regex = /class="(YMlKec[^"]*)">([^<]+)</g;
            let match;
            let count = 0;
            while ((match = regex.exec(html)) !== null) {
                console.log(`Match ${count++}: Class="${match[1]}" Value="${match[2]}"`);
                if (count > 10) break;
            }

        } catch (e) {
            console.error(`${index.ticker} error:`, e.message);
        }
    }
}

run();
