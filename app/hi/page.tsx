import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { fetchArticlesByLanguage } from '@/lib/articlesApi';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { SITE_URL, articlePath } from '@/lib/articleLocale';

// Hindi home: every published Hindi article, newest first.

export const revalidate = 3600;

const TITLE = 'हिंदी में पर्सनल फाइनेंस, सोने का भाव और निवेश की खबरें | gpaisa.in';
const DESCRIPTION = 'gpaisa.in पर हिंदी में पढ़ें सोने-चांदी के भाव, आईपीओ, बचत योजनाओं, लोन और निवेश से जुड़े लेख और गाइड।';

export async function generateMetadata(): Promise<Metadata> {
    // An empty hub would be a soft 404, so it stays noindex until a Hindi article is published.
    const hasArticles = (await fetchArticlesByLanguage('hi', 1, 3600)).length > 0;
    return {
        title: TITLE,
        description: DESCRIPTION,
        openGraph: {
            title: TITLE,
            description: DESCRIPTION,
            type: 'website',
            url: `${SITE_URL}/hi`,
            locale: 'hi_IN',
            siteName: 'gpaisa.in',
        },
        alternates: {
            canonical: `${SITE_URL}/hi`,
            types: { 'application/rss+xml': `${SITE_URL}/hi/feed.xml` },
        },
        robots: hasArticles ? INDEXABLE_ROBOTS : { index: false, follow: true },
    };
}

export default async function HindiHomePage() {
    const articles = await fetchArticlesByLanguage('hi', 60, 3600);

    return (
        <div className="bg-gray-50 py-6 sm:py-8 min-h-screen">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        हिंदी में पर्सनल फाइनेंस
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed">
                        सोने-चांदी के भाव, आईपीओ, बचत योजनाएं, लोन और निवेश — आसान हिंदी में, ताकि आप अपने पैसों से जुड़े
                        फैसले समझदारी से ले सकें।
                    </p>
                    <Link
                        href="/hi/gold-rate"
                        className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold hover:bg-amber-100 transition-colors"
                    >
                        🪙 आज सोने का भाव — 24K, 22K, 18K और शहरवार भाव →
                    </Link>
                </header>

                {articles.length === 0 ? (
                    <p className="text-gray-500 bg-white rounded-xl border border-gray-100 p-8 text-center">
                        हिंदी लेख जल्द आ रहे हैं।{' '}
                        <Link href="/news" className="text-primary-600 hover:underline">English articles पढ़ें</Link>
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, i) => (
                            <Link
                                key={article.id}
                                href={articlePath('hi', article.slug)}
                                className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                            >
                                <div className="relative h-44 bg-gray-100 overflow-hidden">
                                    {article.image_url && (
                                        <Image
                                            src={article.image_url}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            priority={i < 3}
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug mb-2">
                                        {article.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <time dateTime={new Date(article.published_at).toISOString()}>
                                            {new Date(article.published_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </time>
                                        {article.read_time && (
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.read_time}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
