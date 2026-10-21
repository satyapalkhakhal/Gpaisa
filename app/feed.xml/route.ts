import { fetchFeedArticles } from '@/lib/articlesApi';
import { DROPPED_CATEGORY_DB_VALUES, getCategoryByDbValue } from '@/lib/categories';

// RSS 2.0 feed of the latest on-topic articles. Linked from the root layout so
// Google Discover can offer "Follow", and so feed readers can subscribe.
const SITE_URL = 'https://www.gpaisa.in';

export const revalidate = 3600;

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET() {
    let articles: Awaited<ReturnType<typeof fetchFeedArticles>> = [];
    try {
        articles = await fetchFeedArticles(DROPPED_CATEGORY_DB_VALUES, 50, 3600);
    } catch (error) {
        console.error('Error fetching articles for RSS feed:', error);
    }

    const items = articles
        .filter((a) => a.slug)
        .map((a) => {
            const url = `${SITE_URL}/articles/${a.slug}`;
            const category = getCategoryByDbValue(a.category)?.name || a.category;
            return [
                '    <item>',
                `      <title>${escapeXml(a.title)}</title>`,
                `      <link>${url}</link>`,
                `      <guid isPermaLink="true">${url}</guid>`,
                a.published_at ? `      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>` : '',
                `      <dc:creator>${escapeXml(a.author || 'Gpaisa Desk')}</dc:creator>`,
                category ? `      <category>${escapeXml(category)}</category>` : '',
                a.excerpt ? `      <description>${escapeXml(a.excerpt)}</description>` : '',
                a.image_url ? `      <media:content url="${escapeXml(a.image_url)}" medium="image" />` : '',
                '    </item>',
            ].filter(Boolean).join('\n');
        });

    const lastBuild = articles[0]?.published_at ? new Date(articles[0].published_at).toUTCString() : new Date().toUTCString();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>gpaisa.in — Personal finance, gold rates &amp; markets</title>
    <link>${SITE_URL}</link>
    <description>Latest personal finance, gold and silver, credit card and IPO articles from gpaisa.in</description>
    <language>en-IN</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/android-chrome-512x512.png</url>
      <title>gpaisa.in</title>
      <link>${SITE_URL}</link>
    </image>
${items.join('\n')}
  </channel>
</rss>
`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
