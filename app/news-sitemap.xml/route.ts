import { fetchLatestArticles } from '@/lib/supabaseApi';

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET() {
    const baseUrl = 'https://gpaisa.in';
    
    try {
        // Fetch latest articles (last 2 days for Google News)
        const articles = await fetchLatestArticles(1000);
        
        // Filter articles from last 2 days (Google News requirement)
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        const recentArticles = articles.filter(article => {
            const publishDateStr = article.published_at || article.publishedAt;
            if (!publishDateStr) return false;
            
            const publishDate = new Date(publishDateStr);
            return publishDate > twoDaysAgo && article.slug;
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${recentArticles.map(article => {
    const publishDateStr = article.published_at || article.publishedAt;
    const publishDate = publishDateStr ? new Date(publishDateStr) : new Date();
    return `    <url>
        <loc>${baseUrl}/articles/${article.slug}</loc>
        <news:news>
            <news:publication>
                <news:name>Gpaisa</news:name>
                <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${publishDate.toISOString()}</news:publication_date>
            <news:title>${escapeXml(article.title)}</news:title>
        </news:news>${article.featured_image_url ? `
        <image:image>
            <image:loc>${escapeXml(article.featured_image_url)}</image:loc>
            <image:title>${escapeXml(article.title)}</image:title>
            <image:caption>${escapeXml(article.excerpt || article.title)}</image:caption>
        </image:image>` : ''}
    </url>`;
}).join('\n')}
</urlset>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });
    } catch (error) {
        console.error('Error generating news sitemap:', error);
        
        // Return empty sitemap on error
        const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`;
        
        return new Response(errorXml, {
            headers: {
                'Content-Type': 'application/xml',
            },
            status: 500,
        });
    }
}
