// IndexNow: tells Bing, Yandex, Seznam and other participating search engines that URLs changed,
// so they recrawl now instead of on their own schedule. The key is public by design: the engines
// verify it by fetching /<key>.txt (public/56ee34a448613f5fcb6856f1c2887d46.txt).
import { SITE_URL, articleHubPath, articlePath, toArticleLanguage } from './articleLocale';

const INDEXNOW_KEY = '56ee34a448613f5fcb6856f1c2887d46';

export async function notifyIndexNow(paths: string[]): Promise<void> {
    // Only the live site should ping; local and preview builds would announce URLs that 404.
    if (process.env.NODE_ENV !== 'production' || process.env.INDEXNOW_DISABLED === '1' || paths.length === 0) return;
    try {
        const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
                host: new URL(SITE_URL).host,
                key: INDEXNOW_KEY,
                keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
                urlList: [...new Set(paths)].map(p => `${SITE_URL}${p}`),
            }),
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok && res.status !== 202) console.error('[IndexNow] HTTP', res.status, await res.text().catch(() => ''));
    } catch (error) {
        console.error('[IndexNow] failed:', error);
    }
}

/** A published article plus the listing pages that show it. */
export function articleIndexNowPaths(article: { slug: string; language?: string | null; status?: string }): string[] {
    if (article.status !== 'published') return [];
    const lang = toArticleLanguage(article.language);
    return [articlePath(lang, article.slug), articleHubPath(lang), lang === 'hi' ? '/hi' : '/'];
}
