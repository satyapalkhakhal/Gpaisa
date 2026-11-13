import { DROPPED_CATEGORY_DB_VALUES } from '@/lib/categories';
import { fetchNewsSitemapEntries } from '@/lib/articlesApi';
import { SITE_URL, articlePath, toArticleLanguage } from '@/lib/articleLocale';

// Google News sitemap (https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap):
// only articles published in the last 48 hours, so Google picks up fresh news quickly.
// The main /sitemap.xml still lists every article.
export const revalidate = 600;

const escapeXml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export async function GET() {
    const articles = await fetchNewsSitemapEntries(DROPPED_CATEGORY_DB_VALUES, 48).catch(() => []);

    const urls = articles
        .filter(a => a.slug && a.title && a.published_at)
        .map(a => {
            const lang = toArticleLanguage(a.language);
            return `  <url>
    <loc>${SITE_URL}${articlePath(lang, a.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>gpaisa.in</news:name>
        <news:language>${lang}</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.published_at).toISOString()}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`;
        })
        .join('\n');

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=600, must-revalidate',
        },
    });
}
