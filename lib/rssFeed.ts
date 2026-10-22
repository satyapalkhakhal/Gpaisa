import { fetchFeedArticles } from './articlesApi';
import { DROPPED_CATEGORY_DB_VALUES, categoryName, getCategoryByDbValue } from './categories';
import { SITE_URL, articlePath, type ArticleLanguage } from './articleLocale';

// RSS 2.0 feeds of the latest on-topic articles, one per language (/feed.xml, /hi/feed.xml).
// Linked from page <head>s so Google Discover can offer "Follow" and feed readers can subscribe.

const CHANNEL: Record<ArticleLanguage, { title: string; description: string; language: string; path: string; home: string }> = {
    en: {
        title: 'gpaisa.in — Personal finance, gold rates &amp; markets',
        description: 'Latest personal finance, gold and silver, credit card and IPO articles from gpaisa.in',
        language: 'en-IN',
        path: '/feed.xml',
        home: SITE_URL,
    },
    hi: {
        title: 'gpaisa.in हिंदी — पर्सनल फाइनेंस, सोने का भाव और निवेश',
        description: 'gpaisa.in के हिंदी लेख: सोने-चांदी के भाव, आईपीओ, बचत योजनाएं, लोन और निवेश',
        language: 'hi-IN',
        path: '/hi/feed.xml',
        home: `${SITE_URL}/hi`,
    },
};

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function articleFeedResponse(lang: ArticleLanguage): Promise<Response> {
    let articles: Awaited<ReturnType<typeof fetchFeedArticles>> = [];
    try {
        articles = await fetchFeedArticles(DROPPED_CATEGORY_DB_VALUES, 50, 3600, lang);
    } catch (error) {
        console.error(`Error fetching articles for RSS feed (${lang}):`, error);
    }
    const channel = CHANNEL[lang];

    const items = articles
        .filter((a) => a.slug)
        .map((a) => {
            const url = `${SITE_URL}${articlePath(lang, a.slug)}`;
            const def = getCategoryByDbValue(a.category);
            const category = def ? categoryName(def, lang) : a.category;
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
    <title>${channel.title}</title>
    <link>${channel.home}</link>
    <description>${channel.description}</description>
    <language>${channel.language}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}${channel.path}" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/android-chrome-512x512.png</url>
      <title>gpaisa.in</title>
      <link>${channel.home}</link>
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
