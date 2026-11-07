import { CALCULATORS } from '@/lib/calculatorsList';
import { IPO_CALCULATORS } from '@/lib/ipoCalculatorsList';
import { CATEGORIES, categoryPath } from '@/lib/categories';
import { SITE_URL, twinPath } from '@/lib/markdownTwin';

// /llms.txt (https://llmstxt.org): a map of the site for AI assistants, linking each
// section's markdown twin (see lib/markdownTwin.ts).
export const revalidate = 86400;

const link = (name: string, path: string, description?: string) =>
    `- [${name}](${SITE_URL}${twinPath(path)})${description ? `: ${description}` : ''}`;

export function GET() {
    const body = [
        '# gpaisa.in',
        '',
        "> Indian personal finance portal: live gold and silver rates for India and major cities, IPO details with GMP, subscription and allotment status, buybacks, NCDs and rights issues, financial calculators, and finance news.",
        '',
        'Every page is available as markdown at the page URL plus `.md` (the homepage is /index.md), or at the page URL with `Accept: text/markdown`.',
        '',
        '## Gold and silver',
        link('Gold rate today in India', '/gold-rate', '22K, 24K and 18K gold price per gram, with history'),
        link('Silver rate today in India', '/silver-rate', 'silver price per gram and per kg, with history'),
        link('Gold vs silver', '/gold-vs-silver'),
        link('Gold affordability index', '/gold-affordability-index'),
        link('Commodities', '/commodities'),
        '',
        '## IPOs and corporate actions',
        link('IPO list', '/ipo', 'upcoming, open and recently listed mainboard and SME IPOs'),
        link('IPO GMP today', '/ipo/gmp', 'grey market premium for current IPOs'),
        link('IPO listing performance', '/ipo/listing-performance'),
        link('Buybacks', '/buyback'),
        link('NCDs', '/ncd'),
        link('Rights issues', '/rights-issue'),
        ...IPO_CALCULATORS.map(c => link(c.name, `/ipo-calculator/${c.slug}`, c.description)),
        '',
        '## Calculators',
        ...CALCULATORS.map(c => link(c.name, c.href, c.description)),
        '',
        '## News and guides',
        link('Latest news', '/news'),
        ...CATEGORIES.map(c => link(c.name, categoryPath(c, 'en'), c.description)),
        link('Finance glossary', '/glossary'),
        '',
        '## About',
        link('About gpaisa.in', '/about'),
        link('Disclaimer', '/disclaimer'),
        '',
    ].join('\n');

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
